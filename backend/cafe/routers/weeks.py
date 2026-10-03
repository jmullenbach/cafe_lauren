from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, Jobs, User
from ..services import grocery
from ..services import weeks as W

router = APIRouter(prefix="/api/weeks", tags=["weeks"])


@router.get("/{monday}", response_model=s.Week, operation_id="getWeek")
def get_week(monday: date, db: DB, who: User) -> s.Week:
    return W.week_out(db, W.get_or_create_week(db, monday))


@router.post("/{monday}/plan", response_model=s.JobAccepted, status_code=202, operation_id="planWeek")
def plan_week(monday: date, body: s.PlanRequest, db: DB, who: User, jobs: Jobs) -> s.JobAccepted:
    week = W.get_or_create_week(db, monday)
    job = jobs.enqueue(db, J.PLAN_WEEK, {"week_id": week.id, "monday": monday.isoformat(),
                                         "days": body.days, "note": body.note}, who)
    return s.JobAccepted(job=s.Job.model_validate(job))


@router.post("/{monday}/approve", response_model=s.Week, operation_id="approveWeek")
def approve_week(monday: date, db: DB, who: User) -> s.Week:
    week = W.get_or_create_week(db, monday)
    for sl in week.slots:
        if sl.kind == "cook" and sl.status != "rejected":
            sl.status = "approved"
            sl.by = sl.by or who
    week.approved_by = who
    week.approved_at = m.utcnow()
    db.flush()
    week.approved_list = grocery.snapshot(db, week)
    return W.week_out(db, week)
