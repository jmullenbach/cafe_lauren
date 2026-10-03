"""Settings read from the repo-root .env (and the process environment)."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=REPO_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    cafe_db_path: Path = Field(default=REPO_ROOT / "data" / "cafe.db")
    cafe_media_dir: Path = Field(default=REPO_ROOT / "data" / "media")
    cafe_frontend_dist: Path = Field(default=REPO_ROOT / "frontend" / "dist")
    cafe_ai: Literal["fake", "claude"] = "fake"
    cafe_run_migrations: bool = True
    cafe_start_worker: bool = True
    cafe_start_scheduler: bool = True
    cafe_timezone: str = "America/Chicago"
    # Time limit on each AI call, in seconds: the default, and per job type.
    cafe_ai_timeout: float = 120.0
    cafe_ai_timeouts: dict[str, float] = Field(default_factory=lambda: {"plan_week": 240.0, "recipe_fill": 240.0})

    claude_code_oauth_token: str | None = None
    instacart_api_key: str | None = None
    instacart_base: str = "https://connect.dev.instacart.tools"

    def ai_timeout(self, job_type: str) -> float:
        return float(self.cafe_ai_timeouts.get(job_type, self.cafe_ai_timeout))

    @property
    def db_url(self) -> str:
        return f"sqlite:///{self.cafe_db_path}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
