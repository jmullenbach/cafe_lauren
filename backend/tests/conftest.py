from __future__ import annotations

import time
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from cafe.config import Settings
from cafe.main import create_app
from cafe.seed_demo import seed

TERMINAL = {"done", "failed", "resting"}


def H(who: str = "joe") -> dict[str, str]:
    return {"X-Cafe-User": who}


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    return Settings(
        _env_file=None,
        cafe_db_path=tmp_path / "cafe.db",
        cafe_media_dir=tmp_path / "media",
        cafe_frontend_dist=tmp_path / "no-dist",
        cafe_ai="fake",
    )


@pytest.fixture
def app(settings):
    return create_app(settings)


@pytest.fixture
def client(app):
    with TestClient(app, headers=H("joe")) as c:
        yield c


@pytest.fixture
def seeded(client, app, settings):
    with app.state.db.session() as s:
        week = seed(s, settings, copy_photos=False)
        monday = week.monday.isoformat()
    return monday


@pytest.fixture
def state(client, seeded):
    def get(who: str = "joe"):
        return client.get("/api/state", headers=H(who)).json()
    return get


def slot(week: dict, day: str) -> dict:
    return next(s for s in week["slots"] if s["day"] == day)


def wait_job(client, job_id: int, timeout: float = 5.0) -> dict:
    end = time.time() + timeout
    while time.time() < end:
        j = client.get(f"/api/jobs/{job_id}").json()
        if j["status"] in TERMINAL:
            return j
        time.sleep(0.02)
    raise AssertionError(f"job {job_id} did not finish: {j}")


def recipe_id(client, title: str) -> int:
    rows = client.get("/api/recipes", params={"status": "all", "q": title}).json()
    return next(r["id"] for r in rows if r["title"] == title)
