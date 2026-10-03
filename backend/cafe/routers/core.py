"""Bootstrap state, settings, health."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Request
from sqlalchemy import select, text

from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, User
from ..services import grocery
from ..services import weeks as W
from .inbox import queue_out
from .pantry import pantry_status

router = APIRouter(tags=["core"])


@router.get("/api/state", response_model=s.AppState, operation_id="getState")
def get_state(db: DB, who: User, cfg: AppSettingsDep) -> s.AppState:
    people = [s.Person.model_validate(p) for p in db.scalars(select(m.Person).order_by(m.Person.id))]
    week = W.current_week(db, cfg.cafe_timezone)
    reqs = list(db.scalars(select(m.Request).order_by(m.Request.created_at.desc())))
    new = [r for r in reqs if r.status == "new"]
    new_from: list[str] = []
    for r in new:
        if r.who not in new_from:
            new_from.append(r.who)
    items = grocery.derive_items(db, week)
    week_s = W.week_out(db, week)
    jobs = db.scalars(select(m.Job).where(m.Job.status.in_(["queued", "running"])).order_by(m.Job.id))
    on = W.today(cfg.cafe_timezone)
    return s.AppState(
        me=next(p for p in people if p.key == who),
        people=people,
        week=week_s,
        queue=queue_out(db),
        requests=s.RequestCounts(new=len(new), total=len(reqs), new_from=new_from),
        pantry=pantry_status(db),
        list=s.ListStatus(approved=week.approved_at is not None, diff_count=week_s.list_diff_count,
                          total=len(items), unchecked=sum(1 for i in items if not i.checked)),
        jobs=[s.Job.model_validate(j) for j in jobs],
        stores=[s.Store.model_validate(W.store_out(db, st, on)) for st in db.scalars(select(m.Store).order_by(m.Store.id))],
    )


@router.get("/api/settings", response_model=s.AppSettings, operation_id="getSettings")
def get_settings(db: DB, who: User) -> s.AppSettings:
    return W.all_settings(db)


@router.put("/api/settings", response_model=s.AppSettings, operation_id="putSettings")
def put_settings(body: s.AppSettingsUpdate, db: DB, who: User) -> s.AppSettings:
    for k, v in body.model_dump(exclude_unset=True).items():
        if v is not None:
            W.set_setting(db, k, v)
    db.flush()
    return W.all_settings(db)


@router.get("/api/health", response_model=s.Health, operation_id="getHealth")
def health(request: Request, db: DB, cfg: AppSettingsDep) -> s.Health:
    ok_db = True
    last_prep = None
    try:
        db.execute(text("SELECT 1"))
        raw = W.get_setting(db, "last_prep_run")
        last_prep = datetime.fromisoformat(raw) if raw else None
    except Exception:
        ok_db = False
    from importlib.metadata import version

    return s.Health(
        ok=ok_db, database=ok_db, ai_mode=cfg.cafe_ai,
        claude_token="present" if cfg.claude_code_oauth_token else "missing",
        instacart_key=bool(cfg.instacart_api_key), last_prep_run=last_prep,
        worker_running=request.app.state.jobs.running, version=version("cafe"),
    )
