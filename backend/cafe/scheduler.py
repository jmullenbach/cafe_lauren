"""Weekly prep: refresh ads, read deals, create next week, draft the plan.

An APScheduler AsyncIOScheduler (started in the app lifespan) ticks every
minute and runs prep once the configured prep day and time (settings
`prep_day`, `prep_time`, in CAFE_TIMEZONE) has passed and prep has not run
since. Reading the settings on every tick means changes in Settings apply at
once, and a Pi that was off at prep time catches up within PREP_GRACE.

Prep does no AI work itself: it enqueues `ads_refresh` and `plan_week` jobs,
so the worker still runs one AI job at a time, in order (ads before the plan).
The plan job fills only slots no person has touched.
"""

from __future__ import annotations

import logging
from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from sqlalchemy import select

from . import jobs as J
from . import models as m
from .db import Database
from .jobs import JobManager
from .services import ads as ads_service
from .services import planner as P
from .services import weeks as W

log = logging.getLogger("cafe.scheduler")

PREP_GRACE = timedelta(hours=12)
LAST_RUN_KEY = "last_prep_run"
LAST_RESULT_KEY = "last_prep_result"
FIRST_STARTED_KEY = "first_started_at"


def _tz(name: str) -> ZoneInfo:
    try:
        return ZoneInfo(name)
    except Exception:  # pragma: no cover - missing tzdata
        return ZoneInfo("UTC")


def last_scheduled(now: datetime, prep_day: str, prep_time: str) -> datetime:
    """The most recent prep moment at or before `now` (both in local time)."""
    hh, mm = (int(x) for x in prep_time.split(":"))
    target_wd = W.DAYS.index(prep_day)
    d = now.date() - timedelta(days=(now.weekday() - target_wd) % 7)
    at = datetime.combine(d, datetime.min.time()).replace(hour=hh, minute=mm, tzinfo=now.tzinfo)
    if at > now:
        at -= timedelta(days=7)
    return at


def next_monday(today: date) -> date:
    return W.monday_of(today) + timedelta(days=7)


def run_prep(db: Database, jobs: JobManager, *, now: datetime | None = None) -> dict[str, Any]:
    """Weekly prep, callable directly (tests, a manual trigger) or from the scheduler."""
    tz = _tz(db.settings.cafe_timezone)
    now = now or datetime.now(tz)
    with db.session() as s:
        monday = next_monday(now.date())
        existed = s.scalar(select(m.Week.id).where(m.Week.monday == monday)) is not None
        week = W.get_or_create_week(s, monday)
        out: dict[str, Any] = {"monday": monday.isoformat(), "week_created": not existed, "jobs": {}}
        store = week.store
        if store is not None and ads_service.fetcher_for(store.key) is not None:
            j = jobs.enqueue(s, J.ADS_REFRESH, {"store_id": store.id, "store_key": store.key}, "cafe")
            out["jobs"]["ads_refresh"] = j.id
        else:
            out["ads"] = f"{store.name if store else 'No store'}: manual ad upload only"
        days = P.plannable_days(week)
        if days:
            j = jobs.enqueue(s, J.PLAN_WEEK, {"week_id": week.id, "monday": monday.isoformat(), "days": None,
                                              "note": "Weekly prep"}, "cafe")
            out["jobs"]["plan_week"] = j.id
        out["days"] = days
        W.set_setting(s, LAST_RUN_KEY, now.astimezone(ZoneInfo("UTC")).replace(tzinfo=None).isoformat())
        W.set_setting(s, LAST_RESULT_KEY, out)
    log.info("weekly prep: %s", out)
    return out


def _utc_naive(dt: datetime) -> datetime:
    return dt.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)


def ensure_first_started(db: Database, now: datetime | None = None) -> datetime:
    """Record the first boot once (naive UTC); returns it as an aware UTC datetime."""
    with db.session() as s:
        raw = W.get_setting(s, FIRST_STARTED_KEY)
        if not raw:
            raw = _utc_naive(now or datetime.now(ZoneInfo("UTC"))).isoformat()
            W.set_setting(s, FIRST_STARTED_KEY, raw)
    return datetime.fromisoformat(raw).replace(tzinfo=ZoneInfo("UTC"))


def prep_due(db: Database, now: datetime) -> bool:
    first = ensure_first_started(db, now)
    with db.session() as s:
        cfg = W.all_settings(s)
        raw = W.get_setting(s, LAST_RUN_KEY)
    sched = last_scheduled(now, cfg.prep_day, cfg.prep_time)
    if now - sched > PREP_GRACE:
        return False
    if not raw and first >= sched:
        return False  # fresh install: no surprise prep until the next scheduled time
    if raw:
        last = datetime.fromisoformat(raw).replace(tzinfo=ZoneInfo("UTC"))
        if last >= sched:
            return False
    return True


class PrepScheduler:
    def __init__(self, db: Database, jobs: JobManager):
        self.db = db
        self.jobs = jobs
        self.scheduler = None

    async def tick(self) -> None:
        try:
            now = datetime.now(_tz(self.db.settings.cafe_timezone))
            if prep_due(self.db, now):
                run_prep(self.db, self.jobs, now=now)
        except Exception:  # pragma: no cover - never let the scheduler die
            log.exception("weekly prep tick failed")

    def start(self) -> None:
        ensure_first_started(self.db)
        from apscheduler.schedulers.asyncio import AsyncIOScheduler

        self.scheduler = AsyncIOScheduler(timezone=_tz(self.db.settings.cafe_timezone))
        self.scheduler.add_job(self.tick, "interval", minutes=1, id="weekly-prep", coalesce=True,
                               max_instances=1, next_run_time=datetime.now(_tz(self.db.settings.cafe_timezone)))
        self.scheduler.start()

    def stop(self) -> None:
        if self.scheduler is not None:
            self.scheduler.shutdown(wait=False)
            self.scheduler = None

    @property
    def running(self) -> bool:
        return self.scheduler is not None and self.scheduler.running
