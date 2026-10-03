"""Queue ("Up next"), requests (inbox) and staples."""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, User
from ..services import grocery
from ..services import weeks as W

queue_router = APIRouter(prefix="/api/queue", tags=["queue"])
requests_router = APIRouter(prefix="/api/requests", tags=["requests"])
staples_router = APIRouter(prefix="/api/staples", tags=["staples"])


# ---------------------------------------------------------------- queue


def queue_out(db) -> list[s.QueueItem]:
    rows = db.scalars(select(m.QueueEntry).order_by(m.QueueEntry.id))
    return [s.QueueItem(id=q.id, recipe=s.RecipeSummary.model_validate(q.recipe), by=q.by,
                        created_at=q.created_at) for q in rows]


@queue_router.get("", response_model=list[s.QueueItem], operation_id="getQueue")
def get_queue(db: DB, who: User) -> list[s.QueueItem]:
    return queue_out(db)


@queue_router.post("", response_model=list[s.QueueItem], operation_id="addToQueue")
def add_to_queue(body: s.QueueAddRequest, db: DB, who: User) -> list[s.QueueItem]:
    if db.get(m.Recipe, body.recipe_id) is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if db.scalar(select(m.QueueEntry).where(m.QueueEntry.recipe_id == body.recipe_id)) is None:
        db.add(m.QueueEntry(recipe_id=body.recipe_id, by=who))
        db.flush()
    return queue_out(db)


@queue_router.delete("/{recipe_id}", response_model=list[s.QueueItem], operation_id="removeFromQueue")
def remove_from_queue(recipe_id: int, db: DB, who: User) -> list[s.QueueItem]:
    q = db.scalar(select(m.QueueEntry).where(m.QueueEntry.recipe_id == recipe_id))
    if q is not None:
        db.delete(q)
        db.flush()
    return queue_out(db)


# ---------------------------------------------------------------- requests


@requests_router.get("", response_model=list[s.RequestOut], operation_id="listRequests")
def list_requests(db: DB, who: User, status: Literal["new", "planned", "declined", "all"] = "all") -> list[s.RequestOut]:
    stmt = select(m.Request).order_by(m.Request.created_at.desc(), m.Request.id.desc())
    if status != "all":
        stmt = stmt.where(m.Request.status == status)
    return [s.RequestOut.model_validate(r) for r in db.scalars(stmt)]


@requests_router.post("", response_model=s.RequestOut, status_code=201, operation_id="createRequest")
def create_request(body: s.RequestCreate, db: DB, who: User, cfg: AppSettingsDep) -> s.RequestOut:
    week = W.current_week(db, cfg.cafe_timezone)
    r = m.Request(who=who, type=body.type, text=body.text.strip(), status="new", week_id=week.id)
    db.add(r)
    db.flush()
    return s.RequestOut.model_validate(r)


@requests_router.post("/{request_id}/answer", response_model=s.RequestOut, operation_id="answerRequest")
def answer_request(request_id: int, body: s.RequestAnswer, db: DB, who: User, cfg: AppSettingsDep) -> s.RequestOut:
    r = db.get(m.Request, request_id)
    if r is None:
        raise HTTPException(status_code=404, detail="Request not found")
    r.status = body.status
    r.reply = body.reply
    if body.list_items:
        week = db.get(m.Week, r.week_id) if r.week_id else None
        week = week or W.current_week(db, cfg.cafe_timezone)
        for text in body.list_items:
            p = grocery.parse_free_text(text)
            db.add(m.ListAdd(week_id=week.id, name=p.name, qty=p.qty, section=p.section,
                             note=None, from_=r.who))
    db.flush()
    return s.RequestOut.model_validate(r)


# ---------------------------------------------------------------- staples


@staples_router.get("", response_model=list[s.StapleOut], operation_id="listStaples")
def list_staples(db: DB, who: User) -> list[s.StapleOut]:
    return [s.StapleOut.model_validate(x) for x in db.scalars(select(m.Staple).order_by(m.Staple.id))]


@staples_router.post("", response_model=s.StapleOut, status_code=201, operation_id="createStaple")
def create_staple(body: s.StapleCreate, db: DB, who: User) -> s.StapleOut:
    st = m.Staple(name=body.name.strip(), section=body.section or grocery.section_of(body.name),
                  from_=who, active=True)
    db.add(st)
    db.flush()
    return s.StapleOut.model_validate(st)


@staples_router.patch("/{staple_id}", response_model=s.StapleOut, operation_id="patchStaple")
def patch_staple(staple_id: int, body: s.StaplePatch, db: DB, who: User) -> s.StapleOut:
    st = db.get(m.Staple, staple_id)
    if st is None:
        raise HTTPException(status_code=404, detail="Staple not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(st, k, v)
    db.flush()
    return s.StapleOut.model_validate(st)


@staples_router.delete("/{staple_id}", response_model=s.Ok, operation_id="deleteStaple")
def delete_staple(staple_id: int, db: DB, who: User) -> s.Ok:
    st = db.get(m.Staple, staple_id)
    if st is not None:
        db.delete(st)
    return s.Ok()
