from fastapi.testclient import TestClient

from .conftest import H


def test_missing_header_is_400(app):
    with TestClient(app) as c:
        r = c.get("/api/state")
        assert r.status_code == 400
        assert "X-Cafe-User" in r.json()["detail"]


def test_unknown_person_is_400(app):
    with TestClient(app) as c:
        assert c.get("/api/recipes", headers=H("mallory")).status_code == 400
        assert c.post("/api/requests", headers=H("bob"), json={"type": "meal", "text": "x"}).status_code == 400


def test_known_people_pass(app):
    with TestClient(app) as c:
        for who in ("lauren", "joe", "leidy", "Joe"):
            assert c.get("/api/settings", headers=H(who)).status_code == 200


def test_health_needs_no_header(app):
    with TestClient(app) as c:
        r = c.get("/api/health")
        assert r.status_code == 200
        body = r.json()
        assert body["database"] is True and body["ai_mode"] == "fake"
        assert body["worker_running"] is True
        assert body["claude_token"] == "missing"


def test_stream_requires_user_but_accepts_query(app):
    with TestClient(app) as c:
        assert c.get("/api/jobs/stream?max_events=1&timeout=0.1").status_code == 400
        r = c.get("/api/jobs/stream?user=leidy&timeout=0.1")
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("text/event-stream")


def test_media_is_served_without_header(app, settings):
    (settings.cafe_media_dir / "x.txt").write_text("hi")
    with TestClient(app) as c:
        assert c.get("/media/x.txt").text == "hi"


def test_seeded_reference_data(client):
    st = client.get("/api/state").json()
    assert [p["key"] for p in st["people"]] == ["lauren", "joe", "leidy"]
    assert st["me"]["name"] == "Joe"
    assert [s["key"] for s in st["stores"]] == ["cermak", "aldi", "amazon"]
    assert client.get("/api/settings").json()["household_size"] == 5
