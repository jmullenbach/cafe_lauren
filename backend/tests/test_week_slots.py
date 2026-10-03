from sqlalchemy import select

from cafe import models as m

from .conftest import H, recipe_id, slot, wait_job


def test_state_matches_prototype(state):
    st = state()
    w = st["week"]
    assert w["label"].startswith("Week of ")
    assert [s["day"] for s in w["slots"]] == ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    assert slot(w, "mon")["recipe"]["title"] == "Taco Tuesday"
    assert slot(w, "mon")["status"] == "kept" and slot(w, "mon")["votes"] == {"lauren": "up", "joe": "up"}
    assert slot(w, "wed")["status"] == "suggested" and slot(w, "wed")["why"]
    assert slot(w, "thu")["kind"] == "leidy" and slot(w, "thu")["cook"] == "leidy"
    assert slot(w, "sat")["votes"] == {"lauren": "up", "joe": "down"}
    assert st["requests"]["new"] == 3
    assert st["queue"][0]["recipe"]["title"] == "Instant Pot Chicken Tortilla Soup"
    assert st["pantry"]["unsure"] == 2 and st["pantry"]["done"] is False
    assert w["store"]["key"] == "cermak" and w["order_via"] == "delivery"


def test_get_week_by_monday_and_rejects_non_monday(client, seeded):
    assert client.get(f"/api/weeks/{seeded}").json()["monday"] == seeded
    assert client.get("/api/weeks/2026-09-29").status_code == 422
    empty = client.get("/api/weeks/2030-01-07").json()
    assert all(s["kind"] == "open" for s in empty["slots"]) and len(empty["slots"]) == 7


def test_keep(client, state):
    wed = slot(state()["week"], "wed")
    w = client.post(f"/api/slots/{wed['id']}/keep", headers=H("leidy")).json()
    s = slot(w, "wed")
    assert s["status"] == "kept" and s["by"] == "leidy"
    assert s["votes"] == {"joe": "up", "leidy": "up"}


def test_vote_set_change_clear(client, state):
    sat = slot(state()["week"], "sat")
    w = client.post(f"/api/slots/{sat['id']}/vote", json={"value": "up"}, headers=H("leidy")).json()
    assert slot(w, "sat")["votes"] == {"lauren": "up", "joe": "down", "leidy": "up"}
    w = client.post(f"/api/slots/{sat['id']}/vote", json={"value": "up"}, headers=H("joe")).json()
    assert slot(w, "sat")["votes"]["joe"] == "up"
    w = client.post(f"/api/slots/{sat['id']}/vote", json={"value": None}, headers=H("lauren")).json()
    assert "lauren" not in slot(w, "sat")["votes"]
    assert slot(w, "sat")["status"] == "suggested"  # votes are opinions, not decisions


def test_swap_to_recipe_resets_votes_and_leaves_queue(client, state):
    soup = recipe_id(client, "Instant Pot Chicken Tortilla Soup")
    sat = slot(state()["week"], "sat")
    w = client.post(f"/api/slots/{sat['id']}/swap", headers=H("leidy"),
                    json={"kind": "recipe", "recipe_id": soup, "basis": "Quicker"}).json()
    s = slot(w, "sat")
    assert s["recipe_id"] == soup and s["kind"] == "cook" and s["status"] == "edited"
    assert s["by"] == "leidy" and s["basis"] == "Quicker"
    assert s["votes"] == {"leidy": "up"}  # lauren up / joe down cleared
    assert client.get("/api/queue").json() == []


def test_swap_keeps_only_actors_existing_up_vote(client, state):
    sat = slot(state()["week"], "sat")
    w = client.post(f"/api/slots/{sat['id']}/swap", headers=H("lauren"),
                    json={"kind": "text", "text": "Eating out"}).json()
    s = slot(w, "sat")
    assert s["kind"] == "custom" and s["text"] == "Eating out" and s["recipe_id"] is None
    assert s["votes"] == {"lauren": "up"}
    w = client.post(f"/api/slots/{sat['id']}/swap", headers=H("joe"), json={"kind": "leftover"}).json()
    s = slot(w, "sat")
    assert s["kind"] == "leftover" and s["votes"] == {}


def test_swap_leidy_and_open(client, state):
    arroz = recipe_id(client, "Arroz con Pollo")
    tue = slot(state()["week"], "tue")
    w = client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "leidy", "recipe_id": arroz}).json()
    s = slot(w, "tue")
    assert s["kind"] == "leidy" and s["cook"] == "leidy" and s["recipe_id"] == arroz
    assert s["text"] == "Arroz con Pollo (Leidy)"
    w = client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "open"}).json()
    assert slot(w, "tue")["kind"] == "open" and slot(w, "tue")["recipe_id"] is None
    assert client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "text"}).status_code == 422
    assert client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "recipe", "recipe_id": 9999}).status_code == 404


def test_move_swaps_days_and_resets_votes(client, state):
    w0 = state()["week"]
    fri, sat = slot(w0, "fri"), slot(w0, "sat")
    w = client.post(f"/api/slots/{fri['id']}/move", json={"to": "sat"}, headers=H("joe")).json()
    new_sat, new_fri = slot(w, "sat"), slot(w, "fri")
    assert new_sat["id"] == fri["id"] and new_sat["recipe"]["title"] == "Basil Shrimp with Feta and Orzo"
    assert new_sat["status"] == "edited" and new_sat["by"] == "joe"
    assert new_sat["votes"] == {"joe": "up"}          # lauren and leidy cleared, joe's up kept
    assert new_fri["id"] == sat["id"] and new_fri["recipe"]["title"] == "Sheet Pan Citrus Chicken Thighs"
    assert new_fri["votes"] == {}                     # joe had voted down there
    assert new_fri["status"] == "suggested"


def test_set_cook(client, state):
    mon = slot(state()["week"], "mon")
    w = client.post(f"/api/slots/{mon['id']}/cook", json={"cook": "lauren"}).json()
    assert slot(w, "mon")["cook"] == "lauren"


def test_patch_slot_ingredients_marks_edited(client, state):
    wed = slot(state()["week"], "wed")
    ings = [{"qty": "5", "unit": "", "name": "center-cut pork chops"}, {"qty": "2", "unit": "lbs", "name": "carrots"}]
    w = client.patch(f"/api/slots/{wed['id']}", json={"ingredients": ings}, headers=H("lauren")).json()
    s = slot(w, "wed")
    assert s["status"] == "edited" and s["by"] == "lauren" and s["ingredients_edited"]
    assert [i["name"] for i in s["ingredients"]] == ["center-cut pork chops", "carrots"]
    w = client.patch(f"/api/slots/{wed['id']}", json={"reset_ingredients": True}).json()
    assert not slot(w, "wed")["ingredients_edited"]


def test_reject_open_writes_feedback(client, state, app):
    sat = slot(state()["week"], "sat")
    r = client.post(f"/api/slots/{sat['id']}/reject", headers=H("lauren"), json={
        "reasons": ["Too much work"], "note": "busy night", "remember": True, "mode": "open"}).json()
    s = slot(r["week"], "sat")
    assert s["kind"] == "open" and s["status"] == "rejected" and s["recipe_id"] is None
    assert s["basis"] == "Too much work · busy night" and s["votes"] == {} and r["job"] is None
    with app.state.db.session() as db:
        fb = db.get(m.Feedback, r["feedback_id"])
        assert fb.kind == "rejection" and fb.reasons == ["Too much work"] and fb.remember and fb.who == "lauren"
        assert fb.text == "busy night" and fb.recipe_id == sat["recipe_id"]


def test_reject_another_enqueues_replacement(client, state):
    sat = slot(state()["week"], "sat")
    r = client.post(f"/api/slots/{sat['id']}/reject", json={"reasons": ["Had it recently"], "mode": "another"}).json()
    assert slot(r["week"], "sat")["status"] == "thinking"
    job = r["job"]
    assert job["type"] == "replacement" and job["payload"]["feedback_id"] == r["feedback_id"]
    done = wait_job(client, job["id"])
    assert done["status"] == "done" and done["result"]["applied"] is True
    # Café's replacement is a fresh suggestion that echoes the reason
    s = slot(client.get("/api/state").json()["week"], "sat")
    assert s["status"] == "suggested" and s["kind"] == "cook" and s["recipe_id"] != sat["recipe_id"]
    assert s["basis"] == "Had it recently" and s["why"][0] == "You said: Had it recently"


def test_ai_endpoints_enqueue_jobs(client, seeded, state):
    sat = slot(state()["week"], "sat")
    j = client.post(f"/api/weeks/{seeded}/plan", json={}).json()["job"]
    assert j["type"] == "plan_week" and j["status"] == "queued"
    j = client.post(f"/api/slots/{sat['id']}/swap-options", json={"prefs": ["Quicker"], "text": "no fish"}).json()["job"]
    assert j["type"] == "swap_options" and j["payload"]["prefs"] == ["Quicker"]
    j = client.post("/api/recipes/draft", json={"mode": "describe", "text": "slow cooker soup"}).json()["job"]
    assert j["type"] == "recipe_draft"
    j = client.post("/api/pantry/read", json={}).json()["job"]
    assert j["type"] == "pantry_read" and len(j["payload"]["photo_ids"]) == 0  # demo photos are already read
    j = client.post("/api/stores/1/ads/refresh").json()["job"]
    assert j["type"] == "ads_refresh"
    j = client.post("/api/chat", json={"text": "We have leftover rice"}).json()["job"]
    assert j["type"] == "chat"


def test_approve_week(client, seeded, app):
    w = client.post(f"/api/weeks/{seeded}/approve", headers=H("lauren")).json()
    assert w["approved_by"] == "lauren" and w["approved_at"]
    cook = [s for s in w["slots"] if s["kind"] == "cook"]
    assert all(s["status"] == "approved" for s in cook)
    assert {s["day"]: s["by"] for s in cook} == {"mon": "lauren", "wed": "lauren", "fri": "joe", "sat": "lauren"}
    with app.state.db.session() as db:
        week = db.scalar(select(m.Week))
        assert {"plan", "items"} <= set(week.approved_list)
        assert any(i["name"] == "green beans" for i in week.approved_list["items"])
    assert w["list_diff_count"] == 0
