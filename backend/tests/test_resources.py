"""Recipes, queue, requests, pantry, stores, chat proposals, settings, staples."""

import io

from .conftest import H, recipe_id, slot, wait_job


# ---------------------------------------------------------------- recipes

def test_recipe_box_lists_saved_only_with_filters(client, seeded):
    box = client.get("/api/recipes").json()
    assert len(box) == 8 and all(r["status"] == "saved" for r in box)
    assert box[0]["stars"] == 5
    assert {r["title"] for r in client.get("/api/recipes", params={"filter": "5 stars"}).json()} == {
        "Taco Tuesday", "Lauren's Chili", "Instant Pot Chicken Tortilla Soup", "Basil Shrimp with Feta and Orzo"}
    assert [r["title"] for r in client.get("/api/recipes", params={"filter": "Leidy's"}).json()] == ["Arroz con Pollo"]
    assert len(client.get("/api/recipes", params={"filter": "Quick"}).json()) == 4
    assert [r["title"] for r in client.get("/api/recipes", params={"q": "chili"}).json()] == ["Lauren's Chili"]
    assert "Basil Shrimp with Feta and Orzo" in [r["title"] for r in client.get("/api/recipes", params={"q": "orzo"}).json()]
    drafts = client.get("/api/recipes", params={"status": "draft"}).json()
    assert {r["source"] for r in drafts} == {"ai"} and len(drafts) == 5


def test_recipe_detail_patch_save_delete(client, seeded):
    chops = recipe_id(client, "Sheet Pan Pork Chops with Roasted Veggies")
    d = client.get(f"/api/recipes/{chops}").json()
    assert d["on_week_days"] == ["wed"] and d["status"] == "draft" and d["steps"][0]["group"]
    d = client.patch(f"/api/recipes/{chops}", json={"stars": 4, "tags": ["Quick"]}).json()
    assert d["stars"] == 4 and d["tags"] == ["Quick"]
    d = client.post(f"/api/recipes/{chops}/save").json()
    assert d["status"] == "saved"
    tofu = recipe_id(client, "Bok Choy and Tofu Stir Fry")
    assert client.delete(f"/api/recipes/{tofu}").json() == {"ok": True}
    assert client.get(f"/api/recipes/{tofu}").status_code == 404


def test_delete_recipe_on_week_opens_night(client, seeded, state):
    chops = recipe_id(client, "Sheet Pan Pork Chops with Roasted Veggies")
    client.delete(f"/api/recipes/{chops}")
    wed = slot(state()["week"], "wed")
    assert wed["kind"] == "open" and wed["recipe_id"] is None


def test_create_and_cooked(client, seeded):
    r = client.post("/api/recipes", json={"title": "Sausage and Peppers", "method": "Sheet pan",
                                          "ingredients": [{"qty": "2", "unit": "lbs", "name": "Italian sausage"}]}).json()
    assert r["source"] == "manual" and r["status"] == "saved"
    out = client.post(f"/api/recipes/{r['id']}/cooked", json={"stars": 4, "date": "2026-09-30"}, headers=H("leidy")).json()
    assert out["recipe"]["last_made"] == "2026-09-30" and out["recipe"]["stars"] == 4
    assert out["log"]["who"] == "leidy"
    d = client.get(f"/api/recipes/{r['id']}").json()
    assert d["ratings"][0]["stars"] == 4
    tacos = recipe_id(client, "Taco Tuesday")
    out = client.post(f"/api/recipes/{tacos}/cooked", json={"stars": 3}).json()
    assert out["recipe"]["stars"] == 5  # an existing rating is not overwritten by one vote


# ---------------------------------------------------------------- queue

def test_queue_add_remove(client, seeded):
    chili = recipe_id(client, "Lauren's Chili")
    q = client.post("/api/queue", json={"recipe_id": chili}, headers=H("lauren")).json()
    assert [x["recipe"]["title"] for x in q] == ["Instant Pot Chicken Tortilla Soup", "Lauren's Chili"]
    assert q[1]["by"] == "lauren"
    assert len(client.post("/api/queue", json={"recipe_id": chili}).json()) == 2  # idempotent
    q = client.delete(f"/api/queue/{chili}").json()
    assert len(q) == 1
    assert client.get(f"/api/recipes/{chili}").json()["in_queue"] is False
    assert client.post("/api/queue", json={"recipe_id": 999}).status_code == 404


# ---------------------------------------------------------------- requests

def test_requests_create_list_answer(client, seeded):
    r = client.post("/api/requests", json={"type": "out", "text": "Soda water"}, headers=H("joe"))
    assert r.status_code == 201
    new = client.get("/api/requests", params={"status": "new"}).json()
    assert new[0]["text"] == "Soda water" and len(new) == 4
    rid = new[0]["id"]
    a = client.post(f"/api/requests/{rid}/answer", json={"status": "planned", "reply": "Added to the list",
                                                          "list_items": ["2 bottles sparkling water"]}).json()
    assert a["status"] == "planned" and a["reply"] == "Added to the list"
    lst = client.get(f"/api/weeks/{seeded}/list").json()
    bev = next(s for s in lst["sections"] if s["key"] == "beverages")["items"]
    assert any(i["name"] == "sparkling water" and i["qty"] == "2 bottles" and i["from"] == "joe" for i in bev)
    d = client.post(f"/api/requests/{rid}/answer", json={"status": "declined", "reply": "Not this week"}).json()
    assert d["status"] == "declined"
    assert client.get("/api/state").json()["requests"]["new"] == 3


# ---------------------------------------------------------------- pantry

def test_pantry_upload_items_confirm(client, seeded, settings):
    files = [("files", ("fridge.jpg", io.BytesIO(b"\xff\xd8fakejpeg"), "image/jpeg")),
             ("files", ("door.png", io.BytesIO(b"\x89PNGfake"), "image/png"))]
    p = client.post("/api/pantry/photos", files=files, data={"label": "Fridge"}, headers=H("lauren"))
    assert p.status_code == 201
    photos = p.json()["photos"]
    assert len(photos) == 5 and photos[0]["label"] == "Fridge" and photos[0]["uploaded_by"] == "lauren"
    saved = settings.cafe_media_dir / photos[0]["url"].removeprefix("/media/")
    assert saved.exists()
    assert client.get(photos[0]["url"]).status_code == 200
    bad = client.post("/api/pantry/photos", files=[("files", ("x.exe", io.BytesIO(b"x"), "application/octet-stream"))])
    assert bad.status_code == 415

    pantry = client.get("/api/pantry").json()
    unsure = [i for i in pantry["items"] if i["state"] == "unsure"]
    assert len(unsure) == 2 and "Freezer" in pantry["areas"]
    it = client.patch(f"/api/pantry/items/{unsure[0]['id']}", json={"name": "Ground taco meat"}).json()
    assert it["state"] == "confirmed"
    it = client.patch(f"/api/pantry/items/{unsure[1]['id']}", json={"state": "removed"}).json()
    assert it["state"] == "removed"
    new = client.post("/api/pantry/items", json={"area": "Fridge", "name": "Half & half"}, headers=H("leidy")).json()
    assert new["state"] == "confirmed" and new["added_by"] == "leidy"
    out = client.post("/api/pantry/confirm").json()
    assert out["status"]["done"] and out["status"]["needs_review"] == 0
    assert all(i["state"] in ("confirmed", "removed") for i in out["items"])
    assert client.get("/api/state").json()["pantry"]["done"] is True


# ---------------------------------------------------------------- stores

def test_stores_and_deals(client, seeded):
    stores = client.get("/api/stores").json()
    cermak = next(s for s in stores if s["key"] == "cermak")
    assert cermak["deal_count"] == 15 and cermak["ad_from"]
    deals = client.get("/api/deals", params={"store_key": "cermak"}).json()
    assert len(deals) == 15 and all(d["store_key"] == "cermak" for d in deals)
    assert {d["section"] for d in deals} <= set(["produce", "frozen", "meat", "dry", "dairy", "beverages"])


def test_set_store_and_order_via_stay_consistent(client, seeded):
    r = client.put(f"/api/weeks/{seeded}/store", json={"store_key": "aldi"}).json()
    assert r["week"]["store"]["key"] == "aldi" and r["job"] is None  # aldi already has deals
    r = client.put(f"/api/weeks/{seeded}/order-via", json={"order_via": "amazon"}).json()
    assert r["week"]["store"]["key"] == "amazon" and r["notice"] == "Switched ads to Amazon Fresh"
    r = client.put(f"/api/weeks/{seeded}/order-via", json={"order_via": "pickup"}).json()
    assert r["week"]["store"]["key"] == "cermak" and r["week"]["order_via"] == "pickup"
    r = client.put(f"/api/weeks/{seeded}/order-via", json={"order_via": "self"}).json()
    assert r["week"]["store"]["key"] == "cermak" and r["notice"] is None
    r = client.put(f"/api/weeks/{seeded}/store", json={"store_key": "amazon"}).json()
    assert r["job"]["type"] == "ads_refresh"  # no Amazon deals yet, so Café reads the ad
    assert client.put(f"/api/weeks/{seeded}/store", json={"store_key": "nope"}).status_code == 404


def test_manual_ad_upload(client, seeded, settings):
    r = client.post("/api/stores/2/ads/upload", files=[("files", ("ad.jpg", io.BytesIO(b"jpg"), "image/jpeg"))])
    assert r.status_code == 201
    body = r.json()
    assert body["files"][0].startswith("/media/ads/aldi/")
    assert (settings.cafe_media_dir / body["files"][0].removeprefix("/media/")).exists()
    assert body["job"]["type"] == "ads_read" and body["job"]["payload"]["paths"]


# ---------------------------------------------------------------- chat

def test_chat_history_is_per_person(client, seeded):
    assert len(client.get("/api/chat", headers=H("lauren")).json()) == 2
    assert client.get("/api/chat", headers=H("joe")).json() == []
    sent = client.post("/api/chat", json={"text": "Something cheaper than shrimp"}).json()
    assert sent["message"]["from"] == "me" and sent["job"]["type"] == "chat"
    wait_job(client, sent["job"]["id"])
    mine = client.get("/api/chat").json()
    assert mine[0]["text"] == "Something cheaper than shrimp" and [m["from"] for m in mine] == ["me", "cafe"]
    assert len(client.get("/api/chat", headers=H("lauren")).json()) == 2


def test_chat_proposal_apply_and_dismiss(client, seeded, state):
    msgs = client.get("/api/chat", headers=H("lauren")).json()
    prop = msgs[1]
    r = client.post(f"/api/chat/{prop['id']}/proposal", json={"action": "apply"}, headers=H("lauren")).json()
    thu = slot(r["week"], "thu")
    assert thu["recipe"]["title"] == "Bok Choy and Tofu Stir Fry" and thu["kind"] == "cook"
    assert thu["status"] == "edited" and thu["votes"] == {"lauren": "up"}
    assert r["message"]["proposal"]["state"] == "applied"
    assert client.post(f"/api/chat/{prop['id']}/proposal", json={"action": "dismiss"}).status_code == 409
    assert client.post(f"/api/chat/{msgs[0]['id']}/proposal", json={"action": "apply"}).status_code == 404


# ---------------------------------------------------------------- settings and staples

def test_settings_get_put(client):
    s = client.get("/api/settings").json()
    assert s["prep_day"] == "sat" and s["leidy_nights"] == ["thu"] and s["models"]["plan"] == "claude-sonnet-5-5"
    s = client.put("/api/settings", json={"prep_day": "sun", "prep_time": "06:30", "leidy_nights": ["tue", "thu"]}).json()
    assert s["prep_day"] == "sun" and s["prep_time"] == "06:30" and s["leidy_nights"] == ["tue", "thu"]
    assert client.get("/api/settings").json()["household_size"] == 5
    assert client.put("/api/settings", json={"prep_time": "6am"}).status_code == 422


def test_staples_crud_feeds_list(client, seeded):
    st = client.post("/api/staples", json={"name": "Coffee"}, headers=H("lauren")).json()
    assert st["section"] == "beverages" and st["from"] == "lauren"
    names = lambda: {i["name"] for s in client.get(f"/api/weeks/{seeded}/list").json()["sections"] for i in s["items"]}
    assert "Coffee" in names()
    client.patch(f"/api/staples/{st['id']}", json={"active": False})
    assert "Coffee" not in names()
    assert client.delete(f"/api/staples/{st['id']}").json() == {"ok": True}
