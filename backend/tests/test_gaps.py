"""Backend gaps: swap why, slot job_id, resting replacements, no surprise prep on a fresh install."""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from cafe import models as m
from cafe import scheduler as S
from cafe.ai import client as C
from cafe.services import weeks as W

from .conftest import slot, wait_job


@pytest.fixture(autouse=True)
def _reset_ai():
    C.set_ai(None)
    yield
    C.set_ai(None)


# ---- 1. why survives swaps


def test_swap_keeps_explicit_why_and_clears_otherwise(client, seeded, state):
    sat = slot(state()["week"], "sat")
    other = slot(state()["week"], "mon")["recipe_id"]
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": other,
                                                          "why": ["Quick", "On sale"]}).json()
    assert slot(w, "sat")["why"] == ["Quick", "On sale"]
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "text", "text": "Pizza night"}).json()
    assert slot(w, "sat")["why"] == []
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "text", "text": "Pizza", "why": ["Kids asked"]}).json()
    assert slot(w, "sat")["why"] == ["Kids asked"]


def test_swap_uses_swap_options_reasons(client, seeded, state):
    sat = slot(state()["week"], "sat")
    job = client.post(f"/api/slots/{sat['id']}/swap-options", json={"prefs": []}).json()["job"]
    opts = wait_job(client, job["id"])["result"]["options"]
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": opts[1]["recipe_id"]}).json()
    assert slot(w, "sat")["why"] == opts[1]["why"] and opts[1]["why"]
    # an explicit why wins
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": opts[2]["recipe_id"],
                                                          "why": ["Mine"]}).json()
    assert slot(w, "sat")["why"] == ["Mine"]


def test_chat_proposal_detail_becomes_why(client, seeded):
    msg = client.post("/api/chat", json={"text": "What about tofu on Thursday?"}).json()
    wait_job(client, msg["job"]["id"])
    chat = client.get("/api/chat").json()
    cafe = next(x for x in chat if x["proposal"])
    r = client.post(f"/api/chat/{cafe['id']}/proposal", json={"action": "apply"}).json()
    assert slot(r["week"], "thu")["why"] == [cafe["proposal"]["detail"]]


# ---- 2 and 3. slot job_id and resting replacements


class Resting(C.FakeCafeAI):
    async def replacement(self, ctx):
        raise C.AIResting("Café is resting. Try again later.", None)


def test_resting_replacement_reopens_night_and_retry_resumes(client, seeded, state):
    C.set_ai(Resting())
    wed = slot(state()["week"], "wed")
    r = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": ["Too pricey"], "mode": "another"}).json()
    jid = r["job"]["id"]
    assert slot(r["week"], "wed")["status"] == "thinking" and slot(r["week"], "wed")["job_id"] == jid
    assert wait_job(client, jid)["status"] == "resting"
    s = slot(state()["week"], "wed")
    assert s["kind"] == "open" and s["status"] == "rejected" and s["job_id"] == jid
    # Café wakes up; retry puts the night back to thinking and then applies the answer
    C.set_ai(C.FakeCafeAI())
    assert client.post(f"/api/jobs/{jid}/retry").json()["status"] == "queued"
    assert slot(state()["week"], "wed")["status"] in ("thinking", "suggested")
    assert wait_job(client, jid)["status"] == "done"
    s = slot(state()["week"], "wed")
    assert s["kind"] == "cook" and s["status"] == "suggested" and s["job_id"] is None


def test_failed_replacement_keeps_job_id_and_swap_clears_it(client, seeded, state):
    class Broken(C.FakeCafeAI):
        async def replacement(self, ctx):
            raise C.AIError("boom")

    C.set_ai(Broken())
    wed = slot(state()["week"], "wed")
    jid = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": [], "mode": "another"}).json()["job"]["id"]
    assert wait_job(client, jid)["status"] == "failed"
    assert slot(state()["week"], "wed")["job_id"] == jid
    w = client.post(f"/api/slots/{wed['id']}/swap", json={"kind": "text", "text": "Leftovers"}).json()
    assert slot(w, "wed")["job_id"] is None


def test_swap_options_sets_and_clears_job_id(client, seeded, state):
    sat = slot(state()["week"], "sat")
    jid = client.post(f"/api/slots/{sat['id']}/swap-options", json={}).json()["job"]["id"]
    wait_job(client, jid)
    assert slot(state()["week"], "sat")["job_id"] is None


def test_reject_open_has_no_job(client, seeded, state):
    wed = slot(state()["week"], "wed")
    r = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": [], "mode": "open"}).json()
    assert slot(r["week"], "wed")["job_id"] is None


# ---- 4. no surprise prep on a fresh install


def test_fresh_install_does_not_catch_up(app, settings):
    tz = ZoneInfo(settings.cafe_timezone)
    now = datetime(2026, 10, 3, 9, 0, tzinfo=tz)  # Saturday, two hours after the 07:00 prep
    assert not S.prep_due(app.state.db, now)  # first boot recorded just now
    assert not S.prep_due(app.state.db, now + timedelta(hours=1))
    with app.state.db.session() as s:
        assert W.get_setting(s, S.FIRST_STARTED_KEY)
    # the next scheduled prep time is still honoured
    assert S.prep_due(app.state.db, datetime(2026, 10, 10, 7, 1, tzinfo=tz))


def test_old_install_catches_up_and_previous_run_counts(app, settings):
    tz = ZoneInfo(settings.cafe_timezone)
    now = datetime(2026, 10, 3, 9, 0, tzinfo=tz)
    with app.state.db.session() as s:
        W.set_setting(s, S.FIRST_STARTED_KEY, "2026-09-01T00:00:00")
    assert S.prep_due(app.state.db, now)
    with app.state.db.session() as s:
        W.set_setting(s, S.FIRST_STARTED_KEY, "2026-10-03T13:30:00")  # after prep time, but...
        W.set_setting(s, S.LAST_RUN_KEY, "2026-09-26T12:00:00")  # ...a prep was recorded before
    assert S.prep_due(app.state.db, now)
