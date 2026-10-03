"""FastAPI dependencies: database session, acting person, job manager."""

from __future__ import annotations

from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from .config import Settings
from .db import Database
from .jobs import JobManager

PEOPLE = ("lauren", "joe", "leidy")


def get_database(request: Request) -> Database:
    return request.app.state.db


def get_db(request: Request) -> Iterator[Session]:
    with request.app.state.db.session() as s:
        yield s


def get_jobs(request: Request) -> JobManager:
    return request.app.state.jobs


def get_settings_dep(request: Request) -> Settings:
    return request.app.state.settings


def current_user(
    x_cafe_user: Annotated[str | None, Header(description="lauren | joe | leidy")] = None,
) -> str:
    who = (x_cafe_user or "").strip().lower()
    if who not in PEOPLE:
        raise HTTPException(status_code=400, detail="X-Cafe-User header must be one of: lauren, joe, leidy")
    return who


DB = Annotated[Session, Depends(get_db)]
User = Annotated[str, Depends(current_user)]
Jobs = Annotated[JobManager, Depends(get_jobs)]
AppSettingsDep = Annotated[Settings, Depends(get_settings_dep)]
