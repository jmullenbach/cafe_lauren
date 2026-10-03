from __future__ import annotations

import json

import httpx
import pytest
from fastapi.testclient import TestClient

from cafe.config import Settings
from cafe.main import create_app
from cafe.services import instacart
from tests.conftest import H


@pytest.fixture
def calls(monkeypatch):
    log: list[httpx.Request] = []

    def handler(req: httpx.Request) -> httpx.Response:
        log.append(req)
        return httpx.Response(200, json={"products_link_url": f"https://instacart.test/store/shopping_lists/{len(log)}"})

    monkeypatch.setattr(instacart, "TRANSPORT", httpx.MockTransport(handler))
    return log


@pytest.fixture
def keyed(tmp_path):
    s = Settings(_env_file=None, cafe_db_path=tmp_path / "k.db", cafe_media_dir=tmp_path / "media",
                 cafe_frontend_dist=tmp_path / "nodist", cafe_ai="fake", instacart_api_key="test-key")
    return create_app(s), s


@pytest.fixture
def kclient(keyed):
    from cafe.seed_demo import seed
    app, s = keyed
    with TestClient(app, headers=H("joe")) as c:
        with app.state.db.session() as sess:
            monday = seed(sess, s, copy_photos=False).monday.isoformat()
        c.monday = monday
        yield c


def test_unit_mapping():
    assert instacart.map_item("chicken thighs", "2.5 lbs").as_dict() == {
        "name": "chicken thighs", "quantity": 2.5, "unit": "pound", "display_text": "2.5 lbs chicken thighs"}
    assert instacart.map_item("milk", "1 gallon").unit == "gallon"
    assert instacart.map_item("olive oil", "2 tbsp").unit == "tablespoon"
    broc = instacart.map_item("broccoli", "2")
    assert (broc.unit, broc.quantity) == ("each", 2)
    can = instacart.map_item("black beans", "2 cans")  # unit Instacart does not take
    assert (can.unit, can.quantity, can.display_text) == ("each", 1, "2 cans black beans")
    mixed = instacart.map_item("rice", "1 lb + 1 bag")
    assert (mixed.unit, mixed.display_text) == ("each", "1 lb + 1 bag rice")
    assert instacart.map_item("salt", None).display_text == "salt"


def test_not_configured_409_and_health(client, seeded):
    r = client.post(f"/api/weeks/{seeded}/instacart-link")
    assert r.status_code == 409
    assert r.json()["detail"]["code"] == "instacart_not_configured"
    assert client.get("/api/health").json()["instacart"] == "not set up yet"


def test_link_created_cached_and_invalidated(kclient, calls):
    mon = kclient.monday
    assert kclient.get("/api/health").json()["instacart"] == "configured"
    r = kclient.post(f"/api/weeks/{mon}/instacart-link")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["cached"] is False and body["url"].startswith("https://instacart.test/")
    assert len(calls) == 1
    req = calls[0]
    assert req.headers["authorization"] == "Bearer test-key"
    assert str(req.url).endswith("/idp/v1/products/products_link")
    sent = json.loads(req.content)
    assert sent["link_type"] == "shopping_list" and sent["line_items"]
    assert body["item_count"] == len(sent["line_items"])
    assert all({"name", "quantity", "unit", "display_text"} <= set(i) for i in sent["line_items"])

    again = kclient.post(f"/api/weeks/{mon}/instacart-link").json()
    assert again["cached"] is True and again["url"] == body["url"] and len(calls) == 1

    kclient.post(f"/api/weeks/{mon}/list/items", json={"text": "2 lbs apples"})
    third = kclient.post(f"/api/weeks/{mon}/instacart-link").json()
    assert third["cached"] is False and third["url"] != body["url"] and len(calls) == 2


def test_unchecked_only(kclient, calls):
    mon = kclient.monday
    items = [i for sec in kclient.get(f"/api/weeks/{mon}/list").json()["sections"] for i in sec["items"]]
    done = items[0]
    kclient.post(f"/api/weeks/{mon}/list/items/{done['key']}/check", json={"checked": True})
    kclient.post(f"/api/weeks/{mon}/instacart-link")
    sent = json.loads(calls[0].content)["line_items"]
    assert len(sent) == len(items) - 1
    assert done["name"] not in [i["name"] for i in sent]


def test_retailer_key_appended(kclient, keyed, calls):
    app, _ = keyed
    from sqlalchemy import select
    from cafe import models as m
    with app.state.db.session() as s:
        week = s.scalar(select(m.Week))
        week.store.instacart_retailer_key = "cermak-produce"
    url = kclient.post(f"/api/weeks/{kclient.monday}/instacart-link").json()["url"]
    assert url.endswith("?retailer_key=cermak-produce")


def test_instacart_failure_is_502(kclient, monkeypatch):
    monkeypatch.setattr(instacart, "TRANSPORT", httpx.MockTransport(lambda r: httpx.Response(401, text="bad key")))
    r = kclient.post(f"/api/weeks/{kclient.monday}/instacart-link")
    assert r.status_code == 502 and r.json()["detail"]["code"] == "instacart_error"
