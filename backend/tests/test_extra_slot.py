"""The Lunches & breakfast slot: where the staples go."""

from sqlalchemy import select

from cafe import models as m

from .conftest import H, recipe_id, wait_job


def names(client, monday):
    return {i["name"] for s in client.get(f"/api/weeks/{monday}/list").json()["sections"] for i in s["items"]}


def test_week_has_extra_slot_with_staples_by_default(client, seeded):
    for monday in (seeded, "2030-01-07"):  # the seeded week and a brand-new one
        w = client.get(f"/api/weeks/{monday}").json()
        assert len(w["slots"]) == 7 and all(s["day"] != "extra" for s in w["slots"])
        x = w["extra"]
        assert x["day"] == "extra" and x["kind"] == "cook" and x["recipe"]["title"] == "Staples"
        assert x["status"] == "suggested" and x["by"] == "cafe"
        assert "Milk" in [i["name"] for i in x["ingredients"]]
    assert "Milk" in names(client, "2030-01-07")


def test_no_staples_recipe_leaves_it_open(client):
    w = client.get("/api/weeks/2030-01-07").json()
    assert w["extra"]["kind"] == "open" and w["extra"]["recipe"] is None


def test_week_only_edit_follows_to_the_list(client, seeded, state):
    x = state()["week"]["extra"]
    ings = [{"qty": i["qty"], "unit": i["unit"], "name": i["name"]} for i in x["ingredients"] if i["name"] != "Milk"]
    w = client.patch(f"/api/slots/{x['id']}", json={"ingredients": [*ings, {"qty": "2", "unit": "", "name": "Bagels"}]}).json()
    assert w["extra"]["ingredients_edited"] and w["extra"]["status"] == "edited"
    got = names(client, seeded)
    assert "Bagels" in got and "Milk" not in got


def test_on_hand_staple_is_tagged_have(client, seeded, state):
    client.post("/api/pantry/items", json={"area": "Fridge", "name": "Whole milk", "qty": "1 gallon"})
    tags = {i["name"]: i["tag"] for i in state()["week"]["extra"]["ingredients"]}
    assert tags["Milk"] == "have" and tags["Eggs"] == "list"


def test_swap_to_another_staples_recipe_or_empty(client, seeded, state, app):
    with app.state.db.session() as s:
        s.add(m.Recipe(title="Summer staples", tags=["Staples"], status="saved", source="manual", steps=[],
                       ingredients=[{"qty": "", "unit": "", "name": "Popsicles", "group": None}]))
    x = state()["week"]["extra"]
    rid = recipe_id(client, "Summer staples")
    w = client.post(f"/api/slots/{x['id']}/swap", json={"kind": "recipe", "recipe_id": rid}).json()
    assert w["extra"]["recipe"]["title"] == "Summer staples" and w["extra"]["by"] == "joe"
    got = names(client, seeded)
    assert "Popsicles" in got and "Milk" not in got
    # The next new week starts from the one used most recently.
    assert client.get("/api/weeks/2030-01-07").json()["extra"]["recipe"]["title"] == "Summer staples"
    w = client.post(f"/api/slots/{x['id']}/swap", json={"kind": "open"}).json()
    assert w["extra"]["kind"] == "open" and "Popsicles" not in names(client, seeded)


def test_night_only_actions_are_refused(client, state):
    x = state()["week"]["extra"]
    assert client.post(f"/api/slots/{x['id']}/move", json={"to": "mon"}).status_code == 422
    assert client.post(f"/api/slots/{x['id']}/swap-options", json={}).status_code == 422
    assert client.post(f"/api/slots/{x['id']}/reject", json={"mode": "another"}).status_code == 422
    assert client.post(f"/api/slots/{x['id']}/swap", json={"kind": "leftover"}).status_code == 422


def test_staples_filter_and_not_counted_as_a_night(client, seeded):
    assert [r["title"] for r in client.get("/api/recipes", params={"tag": "Staples"}).json()] == ["Staples"]
    rid = recipe_id(client, "Staples")
    assert client.get(f"/api/recipes/{rid}").json()["on_week_days"] == []


def test_plan_fills_staples_and_keeps_them_off_nights(client, app):
    with app.state.db.session() as s:
        s.add(m.Recipe(title="Staples", tags=["Staples"], status="saved", source="manual", steps=[],
                       ingredients=[{"qty": "", "unit": "", "name": "Milk", "group": None}]))
    monday = "2030-01-07"
    assert client.get(f"/api/weeks/{monday}").json()["extra"]["recipe"]["title"] == "Staples"
    with app.state.db.session() as s:  # as if the week existed before any staples recipe did
        x = s.scalar(select(m.Slot).where(m.Slot.day == "extra"))
        x.kind, x.recipe_id, x.status, x.by = "open", None, None, None
    job = client.post(f"/api/weeks/{monday}/plan", json={}, headers=H("joe")).json()["job"]
    assert wait_job(client, job["id"])["status"] == "done"
    w = client.get(f"/api/weeks/{monday}").json()
    assert w["extra"]["recipe"]["title"] == "Staples" and w["extra"]["status"] == "suggested"
    assert all((s["recipe"] or {}).get("title") != "Staples" for s in w["slots"])
    assert "- **Lunches & breakfast:** Staples" in client.get(f"/api/export/weeks/{monday}.md").text


def test_person_choice_survives_a_replan(client, seeded, state):
    x = state()["week"]["extra"]
    client.post(f"/api/slots/{x['id']}/swap", json={"kind": "open"})
    job = client.post(f"/api/weeks/{seeded}/plan", json={}).json()["job"]
    wait_job(client, job["id"])
    assert state()["week"]["extra"]["kind"] == "open"
