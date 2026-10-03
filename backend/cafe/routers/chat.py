from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, Jobs, User
from ..services import weeks as W
from .slots import apply_swap

router = APIRouter(prefix="/api/chat", tags=["chat"])


def msg_out(x: m.ChatMessage) -> s.ChatMessageOut:
    return s.ChatMessageOut.model_validate({
        "id": x.id, "who": x.who, "from": x.from_, "text": x.text, "proposal": x.proposal,
        "week_id": x.week_id, "created_at": x.created_at,
    })


@router.get("", response_model=list[s.ChatMessageOut], operation_id="getChat")
def get_chat(db: DB, who: User, cfg: AppSettingsDep, monday: date | None = None) -> list[s.ChatMessageOut]:
    """Your conversation with Café for a week (default: the current week), oldest first."""
    week = W.get_or_create_week(db, monday) if monday else W.current_week(db, cfg.cafe_timezone)
    rows = db.scalars(select(m.ChatMessage).where(m.ChatMessage.who == who, m.ChatMessage.week_id == week.id)
                      .order_by(m.ChatMessage.id))
    return [msg_out(x) for x in rows]


@router.post("", response_model=s.ChatSendResponse, status_code=202, operation_id="sendChat")
def send_chat(body: s.ChatSend, db: DB, who: User, jobs: Jobs, cfg: AppSettingsDep) -> s.ChatSendResponse:
    week = W.current_week(db, cfg.cafe_timezone)
    msg = m.ChatMessage(who=who, from_="me", text=body.text.strip(), week_id=week.id)
    db.add(msg)
    db.flush()
    job = jobs.enqueue(db, J.CHAT, {"message_id": msg.id, "week_id": week.id, "text": msg.text}, who)
    return s.ChatSendResponse(message=msg_out(msg), job=s.Job.model_validate(job))


@router.post("/{message_id}/proposal", response_model=s.ProposalResponse, operation_id="resolveProposal")
def resolve_proposal(message_id: int, body: s.ProposalAction, db: DB, who: User) -> s.ProposalResponse:
    msg = db.get(m.ChatMessage, message_id)
    if msg is None or not msg.proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    p = s.ChatProposal.model_validate(msg.proposal)
    if p.state != "pending":
        raise HTTPException(status_code=409, detail=f"Proposal already {p.state}")
    week = db.get(m.Week, msg.week_id) if msg.week_id else None
    if week is None:
        raise HTTPException(status_code=409, detail="Proposal has no week")
    if body.action == "apply":
        slot = W.slot_by_day(week, p.day)
        req = (s.SwapRequest(kind="recipe", recipe_id=p.recipe_id, basis=f"Ask Café: {p.label}")
               if p.recipe_id is not None
               else s.SwapRequest(kind="text", text=p.text or p.label, basis=f"Ask Café: {p.label}"))
        apply_swap(db, slot, who, req)
    msg.proposal = {**msg.proposal, "state": "applied" if body.action == "apply" else "dismissed"}
    db.flush()
    return s.ProposalResponse(message=msg_out(msg), week=W.week_out(db, week))
