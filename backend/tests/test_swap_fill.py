"""Light swap options, picking an idea then filling it, superseded asks, and AI time limits."""

from __future__ import annotations

import asyncio
import time

import pytest

from cafe import models as m
from cafe.ai import client as C
from cafe.ai import handlers as Hd
from cafe.ai import schemas as A

from .conftest import H, slot, wait_job


@pytest.fixture(autouse=True)
def _reset_ai():
    C.set_ai(None)
    yield
    C.set_ai(None)


IDEA = C.FakeCafeAI.IDEA["title"]


def wait_status(client, job_id: int, statuses: set[str], timeout: float = 5.0) -> dict:
    end = time.time() + timeout
    while time.time() < end:
        j = client.get(f"/api/jobs/{job_id}").json()
        if j["status"] in statuses:
            return j
        time.sleep(0.02)
    raise AssertionError(f"job {job_id} never reached {statuses}: {j}")


def recipe(client, rid: int) -> dict:
    return client.get(f"/api/recipes/{rid}").json()


# ---------------------------------------------------------------- light options


def test_light_option_schema_has_no_full_recipe():
    sch = A.json_schema(A.SwapOptions)
    pick = sch["properties"]["options"]["items"]
    idea = pick["properties"]["idea"]["anyOf"][0]
    assert set(idea["properties"]) == {"title", "short_title", "description", "method", "total_min", "cost_usd"}
    assert "new_recipe" not in pick["properties"] and "ingredients" not in idea["properties"]
    assert set(A.json_schema(A.MealPick)["properties"]) == {"recipe_id", "idea", "why", "ingredients"}
    assert A.json_schema(A.FillContext)  # renders


def test_swap_options_are_light_and_new_ideas_are_pending_drafts(client, seeded, state):
    sat = slot(state()["week"], "sat")
    job = client.post(f"/api/slots/{sat['id']}/swap-options", json={"prefs": [], "text": "use the pantry"}).json()["job"]
    res = wait_job(client, job["id"])["result"]
    opts = res["options"]
    assert len(opts) == 3
    idea = next(o for o in opts if o["title"] == IDEA)
    assert idea["detail_status"] == "pending" and idea["why"] and idea["main"]
    assert idea["ingredient_flags"]["smoked sausage"]["sale"] == "$2.99"  # flags from Café's notes
    r = recipe(client, idea["recipe_id"])
    assert r["status"] == "draft" and r["detail_status"] == "pending"
    assert r["ingredients"] == [] and r["steps"] == [] and r["total_min"] == 30
    # existing recipes stay complete
    assert all(o["detail_status"] == "complete" for o in opts if o is not idea)
    # asking again reuses the same pending draft rather than duplicating it
    job2 = client.post(f"/api/slots/{sat['id']}/swap-options", json={}).json()["job"]
    opts2 = wait_job(client, job2["id"])["result"]["options"]
    assert next(o for o in opts2 if o["title"] == IDEA)["recipe_id"] == idea["recipe_id"]


# ---------------------------------------------------------------- pick, then fill


def test_pick_new_idea_updates_slot_at_once_then_fill_writes_recipe(client, seeded, state):
    sat = slot(state()["week"], "sat")
    res = wait_job(client, client.post(f"/api/slots/{sat['id']}/swap-options", json={}).json()["job"]["id"])["result"]
    idea = next(o for o in res["options"] if o["title"] == IDEA)

    class SlowFill(C.FakeCafeAI):
        async def fill_recipe(self, ctx):
            await asyncio.sleep(0.4)
            return await super().fill_recipe(ctx)

    C.set_ai(SlowFill())
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": idea["recipe_id"]}).json()
    s = slot(w, "sat")
    assert s["recipe_id"] == idea["recipe_id"] and s["status"] == "edited"
    assert s["recipe"]["detail_status"] == "pending" and s["job_id"]
    assert s["why"] == idea["why"]
    fill = client.get(f"/api/jobs/{s['job_id']}").json()
    assert fill["type"] == "recipe_fill" and fill["payload"]["recipe_id"] == idea["recipe_id"]
    assert fill["payload"]["main"]  # main-ingredient notes travel to the fill

    done = wait_job(client, fill["id"])
    assert done["status"] == "done" and done["result"]["filled"] is True
    r = recipe(client, idea["recipe_id"])
    assert r["detail_status"] == "complete" and r["title"] == IDEA
    assert r["ingredients"] and r["steps"] and all("**" in st for g in r["steps"] for st in g["steps"])
    s = slot(state()["week"], "sat")
    assert s["recipe"]["detail_status"] == "complete" and s["job_id"] is None
    assert s["ingredient_flags"]["smoked sausage"]["sale"] == "$2.99"
    assert any(i["name"] == "smoked sausage" for i in s["ingredients"])


def test_list_with_pending_recipe_does_not_crash(client, app, seeded, state):
    sat = slot(state()["week"], "sat")
    before = client.get(f"/api/weeks/{seeded}/list").json()
    with app.state.db.session() as db:
        r = m.Recipe(title="Pending Idea Bake", description="x", method="Oven", ingredients=[], steps=[],
                     source="ai", status="draft", detail_status="pending")
        db.add(r)
        db.flush()
        sl = db.get(m.Slot, sat["id"])
        sl.kind, sl.recipe_id, sl.status, sl.ingredients_override = "cook", r.id, "edited", None
    lst = client.get(f"/api/weeks/{seeded}/list")
    assert lst.status_code == 200
    names = {i["name"] for sec in lst.json()["sections"] for i in sec["items"]}
    old = {i["name"] for sec in before["sections"] for i in sec["items"]}
    assert "boneless chicken thighs" in old  # Saturday's old recipe contributed...
    assert names <= old  # ...and the pending one adds nothing yet
    assert slot(state()["week"], "sat")["ingredients"] == []


def test_fill_failure_marks_recipe_failed_and_retry_fills(client, seeded, state):
    class BrokenFill(C.FakeCafeAI):
        async def fill_recipe(self, ctx):
            raise C.AIError("fill fell over")

    sat = slot(state()["week"], "sat")
    res = wait_job(client, client.post(f"/api/slots/{sat['id']}/swap-options", json={}).json()["job"]["id"])["result"]
    idea = next(o for o in res["options"] if o["title"] == IDEA)
    C.set_ai(BrokenFill())
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": idea["recipe_id"]}).json()
    jid = slot(w, "sat")["job_id"]
    assert wait_job(client, jid)["status"] == "failed"
    s = slot(state()["week"], "sat")
    assert s["recipe"]["detail_status"] == "failed" and s["job_id"] == jid  # kept for Retry
    C.set_ai(None)
    assert client.post(f"/api/jobs/{jid}/retry").json()["status"] == "queued"
    assert wait_job(client, jid)["status"] == "done"
    assert recipe(client, idea["recipe_id"])["detail_status"] == "complete"


def test_replacement_is_light_then_filled(client, seeded, state):
    class IdeaReplacement(C.FakeCafeAI):
        async def replacement(self, ctx):
            return self._idea_pick(why=[f"You said: {ctx.reasons[0]}", "One pan"])

    C.set_ai(IdeaReplacement())
    wed = slot(state()["week"], "wed")
    r = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": ["Too much work"], "mode": "another"}).json()
    done = wait_job(client, r["job"]["id"])
    assert done["status"] == "done" and done["result"]["applied"] is True and done["result"]["fill_job_id"]
    fill_id = done["result"]["fill_job_id"]
    s = slot(state()["week"], "wed")
    assert s["recipe"]["title"] == IDEA and s["status"] == "suggested" and s["why"][0] == "You said: Too much work"
    assert wait_job(client, fill_id)["status"] == "done"
    s = slot(state()["week"], "wed")
    assert s["recipe"]["detail_status"] == "complete" and s["ingredients"] and s["job_id"] is None


def test_replacement_from_recipe_box_needs_no_fill(client, seeded, state):
    wed = slot(state()["week"], "wed")
    r = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": ["Too pricey"], "mode": "another"}).json()
    done = wait_job(client, r["job"]["id"])
    assert done["result"]["applied"] is True and done["result"]["fill_job_id"] is None
    s = slot(state()["week"], "wed")
    assert s["recipe"]["detail_status"] == "complete" and s["recipe"]["ingredients"]


# ---------------------------------------------------------------- supersede and cancel


class SlowSwap(C.FakeCafeAI):
    def __init__(self, delay: float = 0.6):
        super().__init__()
        self.delay = delay
        self.started: list[str | None] = []
        self.torn_down: list[str | None] = []

    async def swap_options(self, ctx):
        self.started.append(ctx.ask)
        try:
            await asyncio.sleep(self.delay)
        except asyncio.CancelledError:
            self.torn_down.append(ctx.ask)
            raise
        return await super().swap_options(ctx)


def test_newer_ask_cancels_running_and_queued_swap_jobs(client, app, seeded, state):
    ai = SlowSwap()
    C.set_ai(ai)
    sat = slot(state()["week"], "sat")
    url = f"/api/slots/{sat['id']}/swap-options"
    with app.state.db.session() as s:  # keep the one worker busy so j1 is still queued when j2 arrives
        busy = app.state.jobs.enqueue(s, "dummy", {"sleep": 0.4}, "joe").id
    wait_status(client, busy, {"running"})
    j1 = client.post(url, json={"text": "one"}).json()["job"]
    j2 = client.post(url, json={"text": "two"}).json()["job"]  # cancels j1 while it is queued
    assert client.get(f"/api/jobs/{j1['id']}").json()["status"] == "cancelled"
    wait_status(client, j2["id"], {"running"})
    j3 = client.post(url, json={"text": "three"}).json()["job"]  # cancels the running j2
    assert wait_job(client, j3["id"])["status"] == "done"
    assert client.get(f"/api/jobs/{j1['id']}").json()["status"] == "cancelled"
    assert client.get(f"/api/jobs/{j2['id']}").json()["status"] == "cancelled"
    assert ai.started == ["two", "three"]  # j1 never ran
    assert ai.torn_down == ["two"]  # j2's call was cancelled mid-flight
    assert slot(state()["week"], "sat")["job_id"] is None  # cleared when j3 finished


def test_other_slots_swap_jobs_are_not_cancelled(client, seeded, state):
    C.set_ai(SlowSwap(0.2))
    wk = state()["week"]
    a = client.post(f"/api/slots/{slot(wk, 'sat')['id']}/swap-options", json={}).json()["job"]
    b = client.post(f"/api/slots/{slot(wk, 'wed')['id']}/swap-options", json={}).json()["job"]
    assert wait_job(client, a["id"])["status"] == "done" and wait_job(client, b["id"])["status"] == "done"


def test_cancel_running_dummy_job_publishes_cancelled(client, app):
    with app.state.db.session() as s:
        jid = app.state.jobs.enqueue(s, "dummy", {"sleep": 5}, "joe").id
    wait_status(client, jid, {"running"})
    with app.state.db.session() as s:
        assert app.state.jobs.cancel(s, s.get(m.Job, jid)) is True
    r = client.get("/api/jobs/stream", params={"max_events": 1, "timeout": 1.0})
    # the worker is free again at once (the sleeping task was torn down)
    with app.state.db.session() as s:
        nxt = app.state.jobs.enqueue(s, "dummy", {"result": {"ok": 1}}, "joe").id
    assert wait_job(client, nxt, timeout=2)["status"] == "done"
    assert client.get(f"/api/jobs/{jid}").json()["status"] == "cancelled"
    assert r.status_code == 200
    with app.state.db.session() as s:
        assert app.state.jobs.cancel(s, s.get(m.Job, jid)) is False  # already finished


# ---------------------------------------------------------------- time limits


def test_ai_call_timeout_fails_job_with_friendly_message_and_retry_works(client, seeded, state, settings):
    settings.cafe_ai_timeouts = {**settings.cafe_ai_timeouts, "swap_options": 0.2}
    ai = SlowSwap(2.0)
    C.set_ai(ai)
    sat = slot(state()["week"], "sat")
    job = client.post(f"/api/slots/{sat['id']}/swap-options", json={"text": "slow"}).json()["job"]
    failed = wait_job(client, job["id"])
    assert failed["status"] == "failed" and failed["error"] == Hd.TOO_LONG
    assert ai.torn_down == ["slow"]
    C.set_ai(None)
    assert client.post(f"/api/jobs/{job['id']}/retry").status_code == 200
    assert wait_job(client, job["id"])["status"] == "done"


def test_timeout_settings_per_job_type(settings):
    assert settings.ai_timeout("swap_options") == 120
    assert settings.ai_timeout("plan_week") == 240
    assert settings.ai_timeout("recipe_fill") == 240 and settings.ai_timeout("chat") == 120


def test_claude_call_closes_the_sdk_stream_when_cancelled():
    closed = []

    def query_fn(*, prompt, options):
        async def gen():
            try:
                await asyncio.sleep(5)
                yield None
            finally:
                closed.append(True)
        return gen()

    async def go():
        ai = C.ClaudeCafeAI("tok", query_fn=query_fn)
        ctx = A.SwapContext(monday="2026-09-28", days=["sat"], day="sat")
        with pytest.raises(asyncio.TimeoutError):
            await asyncio.wait_for(ai.swap_options(ctx), timeout=0.1)

    asyncio.run(go())
    assert closed == [True]


def test_api_reports_detail_status(client, seeded):
    rows = client.get("/api/recipes", params={"status": "all"}).json()
    assert rows and all(r["detail_status"] == "complete" for r in rows)
    assert H()  # header helper still importable
