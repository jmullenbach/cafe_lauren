"""Phase 2: AI layer with CAFE_AI=fake, plus ClaudeCafeAI driven by a fake SDK stream."""

from __future__ import annotations

import io
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest
from claude_agent_sdk import AssistantMessage, RateLimitEvent, ResultMessage
from claude_agent_sdk.types import RateLimitInfo
from PIL import Image
from sqlalchemy import select

from cafe import models as m
from cafe import scheduler as S
from cafe.ai import client as C
from cafe.ai import handlers as Hd
from cafe.ai import schemas as A
from cafe.services import ads as ads_service
from cafe.services import planner as P
from cafe.services import weeks as W

from .conftest import H, slot, wait_job


@pytest.fixture(autouse=True)
def _reset_ai():
    C.set_ai(None)
    yield
    C.set_ai(None)


def jpeg_bytes(color=(200, 120, 40), size=(64, 48)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, color).save(buf, format="JPEG")
    return buf.getvalue()


def next_monday() -> str:
    return (W.monday_of(date.today()) + timedelta(days=14)).isoformat()


def run_job(client, job: dict) -> dict:
    done = wait_job(client, job["id"])
    assert done["status"] == "done", done
    return done


# ---------------------------------------------------------------- full loop


def test_full_loop_empty_week_to_approved(client, app):
    monday = next_monday()
    week = client.get(f"/api/weeks/{monday}").json()
    assert all(s["kind"] == "open" and s["status"] is None for s in week["slots"])

    job = client.post(f"/api/weeks/{monday}/plan", json={}).json()["job"]
    res = run_job(client, job)["result"]
    assert res["filled"] == ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    week = client.get(f"/api/weeks/{monday}").json()
    mon, tue, thu = slot(week, "mon"), slot(week, "tue"), slot(week, "thu")
    assert mon["kind"] == "cook" and mon["status"] == "suggested" and mon["by"] == "cafe" and mon["why"]
    assert mon["recipe"]["status"] == "draft" and mon["recipe"]["source"] == "ai"  # empty box -> drafts
    assert any(f["sale"] for f in mon["ingredient_flags"].values())
    assert tue["kind"] == "leftover" and "leftovers" in tue["text"]
    assert thu["kind"] == "leidy" and thu["cook"] == "leidy"  # default Leidy night
    assert [r["title"] for r in client.get("/api/recipes").json()] == []  # drafts stay out of the box

    # people act: keep Monday, vote on Wednesday, swap Friday to text
    week = client.post(f"/api/slots/{mon['id']}/keep", headers=H("lauren")).json()
    wed = slot(week, "wed")
    client.post(f"/api/slots/{wed['id']}/vote", json={"value": "down"}, headers=H("leidy"))
    fri = slot(week, "fri")
    client.post(f"/api/slots/{fri['id']}/swap", json={"kind": "text", "text": "Pizza night"})

    # re-planning never touches kept, voted or edited nights
    before = client.get(f"/api/weeks/{monday}").json()
    res = run_job(client, client.post(f"/api/weeks/{monday}/plan", json={}).json()["job"])["result"]
    assert set(res["filled"]) == {"tue", "thu", "sat", "sun"}
    after = client.get(f"/api/weeks/{monday}").json()
    for d in ("mon", "wed", "fri"):
        a, b = slot(after, d), slot(before, d)
        assert (a["recipe_id"], a["status"], a["votes"], a["text"]) == (b["recipe_id"], b["status"], b["votes"], b["text"])

    approved = client.post(f"/api/weeks/{monday}/approve").json()
    assert approved["approved_by"] == "joe"
    assert {slot(approved, d)["status"] for d in ("mon", "wed", "sat")} == {"approved"}
    lst = client.get(f"/api/weeks/{monday}/list").json()
    assert lst["approved"] and lst["total"] > 5 and lst["diff"] == []
    names = {i["name"].lower() for sec in lst["sections"] for i in sec["items"]}
    assert "marinated pork taco meat" in names
    with app.state.db.session() as db:
        wk = db.scalar(select(m.Week).where(m.Week.monday == date.fromisoformat(monday)))
        assert wk.approved_list and wk.approved_list["items"]
        # a draft on an approved week stays usable and still a draft
        assert db.get(m.Recipe, mon["recipe_id"]).status == "draft"


def test_plan_uses_recipe_box_and_context(client, app, seeded):
    with app.state.db.session() as db:
        week = W.get_or_create_week(db, date.fromisoformat(seeded))
        # a remembered rejection, a confirmed pantry item, an older week
        db.add(m.Feedback(kind="rejection", text="no fish on weekdays", reasons=["Kids won't eat it"],
                          remember=True, who="lauren"))
        db.add(m.Feedback(kind="rejection", text="forget me", reasons=[], remember=False, who="joe"))
        db.add(m.PantryItem(area="Pantry", name="Smoked paprika", qty="1 jar", state="confirmed"))
        old = W.get_or_create_week(db, week.monday - timedelta(days=7))
        W.slot_by_day(old, "mon").kind = "custom"
        W.slot_by_day(old, "mon").text = "Pizza night"
        db.flush()
        ctx = P.plan_context(db, week, P.plannable_days(week))
    assert ctx.days == ["tue", "thu", "sun"]  # mon/fri kept, wed/sat have votes
    assert {f["day"] for f in ctx.fixed} >= {"mon", "wed", "fri", "sat"}
    assert [f["text"] for f in ctx.feedback] == ["no fish on weekdays"]
    assert {"area": "Pantry", "name": "Smoked paprika", "qty": "1 jar"} in ctx.pantry
    assert any(d["item"].startswith("Center Cut Pork Chops") for d in ctx.deals)
    assert ctx.queue[0]["title"] == "Instant Pot Chicken Tortilla Soup"
    assert any(r["text"].startswith("Something with salmon") for r in ctx.requests)
    assert ctx.recent_weeks[0]["meals"] == {"mon": "Pizza night"}
    assert all("ingredients" in r for r in ctx.recipe_box)
    assert ctx.leidy_nights == ["thu"] and ctx.household_size == 5


def test_existing_recipe_is_reused_and_flags_filled_from_pantry_and_deals(client, app, seeded):
    with app.state.db.session() as db:
        week = W.get_or_create_week(db, date.fromisoformat(seeded))
        db.add(m.PantryItem(area="Pantry", name="Olive oil", qty="1 bottle", state="confirmed"))
        db.flush()
        chops = db.scalar(select(m.Recipe).where(m.Recipe.title.like("Sheet Pan Pork Chops%")))
        n_recipes = len(db.scalars(select(m.Recipe)).all())
        tue = W.slot_by_day(week, "tue")
        sug = A.MealSuggestion(day="tue", kind="cook", recipe_id=chops.id, why=["Pork chops on sale"])
        assert P.apply_suggestion(db, tue, sug)
        assert tue.recipe_id == chops.id and tue.status == "suggested"
        flags = tue.ingredient_flags
        assert flags["olive oil"]["have"] is True
        assert flags["center-cut pork chop"]["sale"] == "$2.29/lb"
        # a "new" recipe with an existing title reuses the row instead of duplicating it
        again = P.recipe_from_draft(db, C.FakeCafeAI()._draft("chops"))
        assert again.id == chops.id and len(db.scalars(select(m.Recipe)).all()) == n_recipes


# ---------------------------------------------------------------- swap, reject


def test_swap_options_then_swap(client, seeded, state):
    sat = slot(state()["week"], "sat")
    job = client.post(f"/api/slots/{sat['id']}/swap-options", json={"prefs": ["Quicker"], "text": "no fish"}).json()["job"]
    res = run_job(client, job)["result"]
    opts = res["options"]
    assert len(opts) == 3 and res["slot_id"] == sat["id"]
    assert all(o["recipe_id"] and o["why"] for o in opts)
    assert sat["recipe"]["title"] not in [o["title"] for o in opts]
    # the slot itself is untouched until someone picks one
    assert slot(state()["week"], "sat")["recipe_id"] == sat["recipe_id"]
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": opts[0]["recipe_id"]}).json()
    assert slot(w, "sat")["recipe_id"] == opts[0]["recipe_id"] and slot(w, "sat")["status"] == "edited"


def test_reject_another_failure_leaves_night_open(client, seeded, state):
    class Broken(C.FakeCafeAI):
        async def replacement(self, ctx):
            raise C.AIError("model fell over")

    C.set_ai(Broken())
    wed = slot(state()["week"], "wed")
    r = client.post(f"/api/slots/{wed['id']}/reject", json={"reasons": ["Too pricey"], "mode": "another"}).json()
    done = wait_job(client, r["job"]["id"])
    assert done["status"] == "failed" and "model fell over" in done["error"]
    s = slot(state()["week"], "wed")
    assert s["kind"] == "open" and s["status"] == "rejected"


def test_replacement_skips_if_person_changed_the_night(client, app, seeded, state):
    sat = slot(state()["week"], "sat")
    with app.state.db.session() as db:
        db.get(m.Slot, sat["id"]).status = "thinking"
        job = app.state.jobs.enqueue(db, "replacement", {"slot_id": sat["id"], "reasons": []}, "joe")
        db.get(m.Slot, sat["id"]).status = "kept"  # a person acted before Café answered
        jid = job.id
    assert wait_job(client, jid)["result"]["applied"] is False
    assert slot(state()["week"], "sat")["recipe_id"] == sat["recipe_id"]


# ---------------------------------------------------------------- pantry


def test_pantry_read_produces_found_and_unsure(client):
    files = [("files", (f"p{i}.jpg", jpeg_bytes(), "image/jpeg")) for i in range(3)]
    pantry = client.post("/api/pantry/photos", files=files, data={"label": "Freezer"}).json()
    assert len(pantry["photos"]) == 3
    job = client.post("/api/pantry/read", json={}).json()["job"]
    res = run_job(client, job)["result"]
    assert res["photos"] == 3 and res["items"] == 10 and res["unsure"] == 2
    pantry = client.get("/api/pantry").json()
    assert {i["state"] for i in pantry["items"]} == {"found", "unsure"}
    assert all(i["photo_id"] for i in pantry["items"])
    assert all(p["read_at"] for p in pantry["photos"])
    assert pantry["status"]["needs_review"] == 10 and pantry["status"]["done"] is False
    # reading the same photos again replaces the unconfirmed reads instead of duplicating them
    ids = [p["id"] for p in pantry["photos"]]
    run_job(client, client.post("/api/pantry/read", json={"photo_ids": ids}).json()["job"])
    assert len(client.get("/api/pantry").json()["items"]) == 10
    # nothing left to read
    res = run_job(client, client.post("/api/pantry/read", json={}).json()["job"])["result"]
    assert res["items"] == 0


# ---------------------------------------------------------------- chat


def test_chat_produces_pending_proposal(client, seeded, state):
    sent = client.post("/api/chat", json={"text": "Make Wednesday vegetarian"}, headers=H("lauren")).json()
    res = run_job(client, sent["job"])["result"]
    msgs = client.get("/api/chat", headers=H("lauren")).json()
    reply = msgs[-1]
    assert reply["id"] == res["message_id"] and reply["from"] == "cafe"
    p = reply["proposal"]
    assert p["state"] == "pending" and p["day"] == "wed" and p["recipe_id"]
    wed_before = slot(state()["week"], "wed")
    assert wed_before["recipe"]["title"] != "Bok Choy and Tofu Stir Fry"  # chat never edits directly
    r = client.post(f"/api/chat/{reply['id']}/proposal", json={"action": "apply"}, headers=H("lauren")).json()
    assert slot(r["week"], "wed")["recipe_id"] == p["recipe_id"]


# ---------------------------------------------------------------- recipe drafts


def test_recipe_draft_only_saved_through_save(client):
    job = client.post("/api/recipes/draft", json={"mode": "describe", "text": "sheet pan sausage and peppers"}).json()["job"]
    res = run_job(client, job)["result"]
    r = client.get(f"/api/recipes/{res['recipe_id']}").json()
    assert r["status"] == "draft" and r["source"] == "ai" and r["title"] == "Sheet Pan Sausage And Peppers"
    assert r["ingredients"] and r["steps"]
    assert client.get("/api/recipes").json() == []
    assert client.post(f"/api/recipes/{r['id']}/save").json()["status"] == "saved"
    assert [x["id"] for x in client.get("/api/recipes").json()] == [r["id"]]


def test_recipe_draft_from_link_and_photo(client, app, settings, monkeypatch):
    html = """<html><head><script type="application/ld+json">
    {"@context":"https://schema.org","@graph":[{"@type":"WebPage"},{"@type":"Recipe","name":"Skillet Gnocchi",
     "recipeIngredient":["1 lb gnocchi","1 lb sausage"],"recipeInstructions":"Brown it."}]}
    </script><style>.x{}</style></head><body><nav>Menu</nav><h1>Skillet Gnocchi</h1><p>Weeknight dinner.</p></body></html>"""
    seen = {}

    async def fake_fetch(url):
        seen["url"] = url
        return html

    class Spy(C.FakeCafeAI):
        async def draft_recipe(self, src):
            seen["src"] = src
            return await super().draft_recipe(src)

    monkeypatch.setattr(Hd, "fetch_page", fake_fetch)
    C.set_ai(Spy())
    run_job(client, client.post("/api/recipes/draft", json={"mode": "link", "url": "https://x.test/r"}).json()["job"])
    assert seen["url"] == "https://x.test/r"
    txt = seen["src"].page_text
    assert '"name": "Skillet Gnocchi"' in txt and "1 lb gnocchi" in txt and "Weeknight dinner." in txt
    assert "Menu" not in txt and ".x{}" not in txt

    (settings.cafe_media_dir / "recipes").mkdir(parents=True)
    (settings.cafe_media_dir / "recipes" / "card.jpg").write_bytes(jpeg_bytes())
    run_job(client, client.post("/api/recipes/draft", json={"mode": "photo", "photo_path": "recipes/card.jpg"}).json()["job"])
    assert seen["src"].photo.name == "card.jpg"
    bad = wait_job(client, client.post("/api/recipes/draft", json={"mode": "photo", "photo_path": "../../etc/passwd"}).json()["job"]["id"])
    assert bad["status"] == "failed"


# ---------------------------------------------------------------- ads


def test_ads_upload_reads_deals(client):
    stores = client.get("/api/stores").json()
    aldi = next(s for s in stores if s["key"] == "aldi")
    r = client.post(f"/api/stores/{aldi['id']}/ads/upload",
                    files=[("files", ("ad1.jpg", jpeg_bytes(), "image/jpeg")), ("files", ("ad2.jpg", jpeg_bytes(), "image/jpeg"))]).json()
    res = run_job(client, r["job"])["result"]
    assert res["images"] == 2 and res["deals"] == 15
    deals = client.get("/api/deals", params={"store_key": "aldi"}).json()
    assert len(deals) == 15 and all(d["source_image"].startswith("ads/aldi/") for d in deals)
    assert {d["section"] for d in deals} <= {"produce", "frozen", "meat", "dry", "dairy", "beverages"}


def test_ads_refresh_without_scraper_is_manual(client):
    aldi = next(s for s in client.get("/api/stores").json() if s["key"] == "aldi")
    res = run_job(client, client.post(f"/api/stores/{aldi['id']}/ads/refresh").json()["job"])["result"]
    assert res["manual"] is True and "Upload photos" in res["message"]


def test_cermak_fetcher_parses_page():
    html = """<img src="/wp-content/uploads/Cermak4_1_092426.jpg"><img data-src="logo.png">
    <a href="https://cdn.example.com/Cermak4_2_092426.jpg">p2</a><img src="/wp-content/uploads/Cermak4_1_092426.jpg">"""
    urls = ads_service.CermakFetcher().image_urls(html, "https://www.cermakproduce.com/weekly-ads/")
    assert urls == ["https://www.cermakproduce.com/wp-content/uploads/Cermak4_1_092426.jpg",
                    "https://cdn.example.com/Cermak4_2_092426.jpg"]
    assert ads_service.fetcher_for("aldi") is None


def fake_download(media_dir: Path):
    async def download(store_key, ads_url, media, *, on=None, client=None):
        folder = Path("ads") / store_key / (on or date.today()).isoformat()
        (media / folder).mkdir(parents=True, exist_ok=True)
        out = []
        for i in (1, 2):
            rel = folder / f"Cermak4_{i}_092426.jpg"
            (media / rel).write_bytes(jpeg_bytes())
            out.append(rel.as_posix())
        return out
    return download


def test_ads_refresh_downloads_then_reads_and_skips_repeat(client, monkeypatch, settings):
    monkeypatch.setattr(ads_service, "download", fake_download(settings.cafe_media_dir))
    cermak = next(s for s in client.get("/api/stores").json() if s["key"] == "cermak")
    res = run_job(client, client.post(f"/api/stores/{cermak['id']}/ads/refresh").json()["job"])["result"]
    assert res["deals"] == 15 and len(res["files"]) == 2
    res = run_job(client, client.post(f"/api/stores/{cermak['id']}/ads/refresh").json()["job"])["result"]
    assert res["skipped"] and len(client.get("/api/deals", params={"store_key": "cermak"}).json()) == 15


# ---------------------------------------------------------------- scheduler


def test_weekly_prep_runs_directly(client, app, monkeypatch, settings):
    monkeypatch.setattr(ads_service, "download", fake_download(settings.cafe_media_dir))
    tz = ZoneInfo(settings.cafe_timezone)
    now = datetime(2026, 10, 3, 7, 5, tzinfo=tz)  # a Saturday, just after 07:00
    with app.state.db.session() as s:
        W.set_setting(s, S.FIRST_STARTED_KEY, "2026-09-01T00:00:00")  # not a fresh install
    assert S.prep_due(app.state.db, now)
    out = S.run_prep(app.state.db, app.state.jobs, now=now)
    assert out["monday"] == "2026-10-05" and out["week_created"] and set(out["jobs"]) == {"ads_refresh", "plan_week"}
    ads_job = wait_job(client, out["jobs"]["ads_refresh"])
    plan_job = wait_job(client, out["jobs"]["plan_week"])
    assert ads_job["status"] == plan_job["status"] == "done"
    assert ads_job["updated_at"] <= plan_job["updated_at"]  # deals are read before planning
    week = client.get("/api/weeks/2026-10-05").json()
    assert all(s["by"] == "cafe" for s in week["slots"])
    assert slot(week, "wed")["ingredient_flags"]  # sale flags from the freshly read deals
    assert not S.prep_due(app.state.db, now + timedelta(minutes=5))  # ran already
    health = client.get("/api/health").json()
    assert health["last_prep_run"] and health["last_prep_result"]["monday"] == "2026-10-05"

    # next week's prep leaves nights a person touched alone
    wed = slot(week, "wed")
    client.post(f"/api/slots/{wed['id']}/keep")
    out = S.run_prep(app.state.db, app.state.jobs, now=now)
    assert "wed" not in out["days"] and not out["week_created"]
    assert wait_job(client, out["jobs"]["ads_refresh"])["result"]["skipped"]
    wait_job(client, out["jobs"]["plan_week"])
    assert slot(client.get("/api/weeks/2026-10-05").json(), "wed")["status"] == "kept"


def test_prep_schedule_math():
    tz = ZoneInfo("America/Chicago")
    sat_7 = datetime(2026, 10, 3, 7, 0, tzinfo=tz)
    assert S.last_scheduled(datetime(2026, 10, 3, 6, 59, tzinfo=tz), "sat", "07:00") == sat_7 - timedelta(days=7)
    assert S.last_scheduled(datetime(2026, 10, 6, 12, 0, tzinfo=tz), "sat", "07:00") == sat_7
    assert S.next_monday(date(2026, 10, 3)) == date(2026, 10, 5)


def test_prep_not_due_long_after_schedule(app, settings):
    tz = ZoneInfo(settings.cafe_timezone)
    assert not S.prep_due(app.state.db, datetime(2026, 10, 4, 12, 0, tzinfo=tz))  # Sunday noon: missed, skip
    assert not S.prep_due(app.state.db, datetime(2026, 10, 3, 6, 0, tzinfo=tz))


# ---------------------------------------------------------------- ClaudeCafeAI with a fake SDK stream


def result_msg(data=None, **kw):
    base = dict(subtype="success", duration_ms=5, duration_api_ms=4, is_error=False, num_turns=2, session_id="s",
                structured_output=data, total_cost_usd=0.01)
    base.update(kw)
    return ResultMessage(**base)


class FakeSDK:
    """Stands in for claude_agent_sdk.query: yields scripted messages per call."""

    def __init__(self, *scripts):
        self.scripts = list(scripts)
        self.options = []
        self.prompts = []

    def __call__(self, *, prompt, options):
        self.options.append(options)
        script = self.scripts.pop(0)

        async def gen():
            async for msg in prompt:
                self.prompts.append(msg)
            for item in script:
                if isinstance(item, Exception):
                    raise item
                yield item
        return gen()


def plan_dict(day="mon"):
    sug = C.FakeCafeAI()._meal("chops", day, [])
    return {"slots": [sug.model_dump(mode="json")], "summary": "One night."}


def test_claude_validation_retry_then_success(client, app, monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "should-be-removed")
    sdk = FakeSDK([result_msg({"slots": [{"day": "funday"}]})], [result_msg(plan_dict("mon"))])
    ai = C.ClaudeCafeAI("tok-secret", {"plan": "claude-test-model"}, query_fn=sdk)
    C.set_ai(ai)
    monday = next_monday()
    job = client.post(f"/api/weeks/{monday}/plan", json={"days": ["mon"]}).json()["job"]
    res = run_job(client, job)["result"]
    assert res["filled"] == ["mon"] and len(sdk.options) == 2
    o = sdk.options[0]
    assert o.tools == [] and o.setting_sources == [] and o.max_turns >= 3 and o.model == "claude-test-model"
    assert o.output_format["type"] == "json_schema" and "$ref" not in str(o.output_format["schema"])
    assert o.env == {"CLAUDE_CODE_OAUTH_TOKEN": "tok-secret"}
    assert "Lauren's Chili" in o.system_prompt and "**bold**" in o.system_prompt
    retry_text = sdk.prompts[1]["message"]["content"][-1]["text"]
    assert "did not match the required JSON schema" in retry_text
    import os
    assert "ANTHROPIC_API_KEY" not in os.environ
    assert "tok-secret" not in repr(ai)


def test_claude_validation_fails_twice_marks_failed(client):
    sdk = FakeSDK([result_msg({"bad": 1})], [result_msg(None)])
    C.set_ai(C.ClaudeCafeAI("tok", query_fn=sdk))
    j = wait_job(client, client.post(f"/api/weeks/{next_monday()}/plan", json={}).json()["job"]["id"])
    assert j["status"] == "failed" and "did not validate" in j["error"]


def test_claude_rate_limit_marks_job_resting(client):
    info = RateLimitInfo(status="rejected", raw={}, resets_at=1_900_000_000, rate_limit_type="five_hour")
    sdk = FakeSDK([RateLimitEvent(rate_limit_info=info, uuid="u", session_id="s"),
                   AssistantMessage(content=[], model="m", error="rate_limit"),
                   result_msg(None, is_error=True, api_error_status=429),
                   RuntimeError("Command failed with exit code 1")])
    C.set_ai(C.ClaudeCafeAI("tok", query_fn=sdk))
    j = wait_job(client, client.post("/api/pantry/read", json={"photo_ids": []}).json()["job"]["id"])
    assert j["status"] == "done"  # nothing to read: no call made
    files = [("files", ("p.jpg", jpeg_bytes(), "image/jpeg"))]
    client.post("/api/pantry/photos", files=files)
    j = wait_job(client, client.post("/api/pantry/read", json={}).json()["job"]["id"])
    assert j["status"] == "resting" and j["error"] == "Café is resting. Try again later."
    img = sdk.prompts[0]["message"]["content"][0]
    assert img["type"] == "image" and img["source"]["media_type"] == "image/jpeg"


def test_claude_auth_failure_reported_by_health(client, settings):
    settings.claude_code_oauth_token = "tok-bad"
    sdk = FakeSDK([AssistantMessage(content=[], model="m", error="authentication_failed"),
                   result_msg(None, is_error=True, api_error_status=401, result="API Error: 401 sk-ant-oat01-ABC"),
                   RuntimeError("exit 1")],
                  [result_msg(plan_dict("tue"))])
    C.set_ai(C.ClaudeCafeAI("tok-bad", query_fn=sdk))
    assert client.get("/api/health").json()["claude_token"] == "present"
    settings.cafe_ai = "claude"
    try:
        j = wait_job(client, client.post(f"/api/weeks/{next_monday()}/plan", json={}).json()["job"]["id"])
        assert j["status"] == "failed" and "token rejected" in j["error"] and "tok-bad" not in j["error"]
        h = client.get("/api/health").json()
        assert h["claude_token"] == "rejected" and h["claude_token_message"] == "Claude token rejected"
        run_job(client, client.post(f"/api/weeks/{next_monday()}/plan", json={"days": ["tue"]}).json()["job"])
        assert client.get("/api/health").json()["claude_token"] == "present"  # a good call clears it
    finally:
        settings.cafe_ai = "fake"


def test_missing_token_is_auth_error():
    with pytest.raises(C.ClaudeAuthError):
        import asyncio
        asyncio.run(C.ClaudeCafeAI(None).plan_week(A.PlanContext(monday="2026-10-05", days=["mon"])))


def test_classify_and_scrub():
    assert C.classify(None, [], result_msg({}), None) == "ok"
    assert C.classify("rate_limit", [], None, None) == "resting"
    assert C.classify(None, [], result_msg(None, is_error=True, api_error_status=529), None) == "failed"
    assert C.classify(None, [], None, RuntimeError("x")) == "failed"
    assert C.classify(None, [], result_msg(None, is_error=True, api_error_status=403), None) == "auth"
    assert "sk-ant" not in C._scrub("bad sk-ant-oat01-xyz_123 token", None)


def test_json_schemas_are_flat_and_strict():
    for model in (A.PlanSuggestion, A.SwapOptions, A.MealSuggestion, A.PantryReadResult, A.AdsReadResult,
                  A.RecipeDraft, A.ChatReply):
        sch = A.json_schema(model)
        assert "$ref" not in str(sch) and "$defs" not in sch
        assert set(sch["required"]) == set(sch["properties"]) and sch["additionalProperties"] is False
        assert set(sch["properties"]) == set(model.model_fields)
    recipe = A.json_schema(A.RecipeDraft)
    assert "title" in recipe["properties"] and "title" in recipe["required"]
    meal = A.json_schema(A.MealSuggestion)["properties"]["new_recipe"]["anyOf"][0]
    assert "title" in meal["required"] and meal["properties"]["title"] == {"type": "string", "description": "Title Case meal title."}


def test_encode_image_resizes(tmp_path):
    p = tmp_path / "big.png"
    Image.new("RGB", (3000, 1500), (10, 20, 30)).save(p)
    block = C.encode_image(p, 1024)
    import base64
    im = Image.open(io.BytesIO(base64.b64decode(block["source"]["data"])))
    assert max(im.size) == 1024 and im.format == "JPEG"
