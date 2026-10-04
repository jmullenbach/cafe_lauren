"""Who's cooking: recipe defaults carry to slots; /cook is a plain label change."""
from .conftest import H, recipe_id, slot


def test_default_cook_seeded_and_patchable(client, seeded):
    tacos = recipe_id(client, "Taco Tuesday")
    assert client.get(f"/api/recipes/{tacos}").json()["default_cook"] == "joe"
    r = client.patch(f"/api/recipes/{tacos}", json={"default_cook": "leidy"}).json()
    assert r["default_cook"] == "leidy"
    r = client.patch(f"/api/recipes/{tacos}", json={"default_cook": None}).json()
    assert r["default_cook"] is None
    assert client.patch(f"/api/recipes/{tacos}", json={"default_cook": "bob"}).status_code == 422


def test_swap_carries_default_cook(client, state):
    chili = recipe_id(client, "Lauren's Chili")
    sat = slot(state()["week"], "sat")
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": chili}).json()
    assert slot(w, "sat")["cook"] == "lauren"
    soup = recipe_id(client, "Instant Pot Chicken Tortilla Soup")  # no default
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": soup}).json()
    assert slot(w, "sat")["cook"] is None
    w = client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "leftover"}).json()
    assert slot(w, "sat")["cook"] is None


def test_leidy_slot_cook_and_open_night(client, state):
    tue = slot(state()["week"], "tue")
    tacos = recipe_id(client, "Taco Tuesday")
    w = client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "recipe", "recipe_id": tacos}).json()
    assert slot(w, "tue")["cook"] == "joe"
    arroz = recipe_id(client, "Arroz con Pollo")
    w = client.post(f"/api/slots/{tue['id']}/swap", json={"kind": "leidy", "recipe_id": arroz}).json()
    assert slot(w, "tue")["cook"] == "leidy"


def test_chat_apply_carries_default(client, seeded):
    prop = client.get("/api/chat", headers=H("lauren")).json()[1]
    r = client.post(f"/api/chat/{prop['id']}/proposal", json={"action": "apply"}, headers=H("lauren")).json()
    thu = slot(r["week"], "thu")
    rid = thu["recipe_id"]
    assert thu["cook"] == client.get(f"/api/recipes/{rid}").json()["default_cook"]


def test_set_cook_keeps_votes_status_and_approval(client, state):
    w0 = state()["week"]
    fri = slot(w0, "fri")
    w = client.post(f"/api/slots/{fri['id']}/cook", json={"cook": "leidy"}, headers=H("lauren")).json()
    s = slot(w, "fri")
    assert s["cook"] == "leidy" and s["votes"] == fri["votes"] and s["status"] == fri["status"] == "kept"
    assert s["by"] == fri["by"]
    w = client.post(f"/api/slots/{fri['id']}/cook", json={"cook": None}).json()
    assert slot(w, "fri")["cook"] is None and slot(w, "fri")["votes"] == fri["votes"]
    assert client.post(f"/api/slots/{fri['id']}/cook", json={"cook": "nobody"}).status_code == 422
    assert w["approved_by"] == w0["approved_by"]
