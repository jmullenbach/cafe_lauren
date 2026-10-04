from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlalchemy import delete, select

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, Jobs, User
from ..services import planner as P
from ..services import weeks as W

router = APIRouter(prefix="/api/slots", tags=["slots"])


def _recipe(db, recipe_id: int | None) -> m.Recipe:
    r = db.get(m.Recipe, recipe_id) if recipe_id is not None else None
    if r is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return r


def _person_key(db, key: str | None) -> str | None:
    if key is None:
        return None
    if db.scalar(select(m.Person.id).where(m.Person.key == key)) is None:
        raise HTTPException(status_code=422, detail=f"Unknown person: {key}")
    return key


@router.post("/{slot_id}/keep", response_model=s.Week, operation_id="keepSlot")
def keep(slot_id: int, db: DB, who: User) -> s.Week:
    slot = W.get_slot(db, slot_id)
    slot.status = "kept"
    slot.by = who
    W.set_vote(db, slot, who, "up")
    return W.week_out(db, slot.week)


@router.post("/{slot_id}/vote", response_model=s.Week, operation_id="voteSlot")
def vote(slot_id: int, body: s.VoteRequest, db: DB, who: User) -> s.Week:
    slot = W.get_slot(db, slot_id)
    W.set_vote(db, slot, who, body.value)
    return W.week_out(db, slot.week)


def _option(db, slot: m.Slot, recipe_id: int) -> dict:
    """This recipe's row in the slot's latest swap_options results (why[], main-ingredient notes)."""
    jobs = db.scalars(select(m.Job).where(m.Job.type == J.SWAP_OPTIONS, m.Job.status == "done")
                      .order_by(m.Job.id.desc()).limit(30))
    for job in jobs:
        res = job.result or {}
        if res.get("slot_id") != slot.id:
            continue
        for o in res.get("options") or []:
            if o.get("recipe_id") == recipe_id:
                return o
    return {}


def apply_swap(db, slot: m.Slot, who: str, body: s.SwapRequest, by: str | None = None, jobs=None) -> None:
    """Shared by /swap and chat proposals. Resets votes per the swap rule.

    Picking a new idea Café has not written out yet takes effect at once; with `jobs`, a
    recipe_fill job is queued to write its ingredients and steps (slot.job_id points at it)."""
    by = by or who
    slot.ingredients_override = None
    slot.job_id = None
    slot.basis = body.basis
    slot.by = by
    if body.kind == "recipe":
        r = _recipe(db, body.recipe_id)
        slot.kind, slot.recipe_id, slot.text, slot.status = "cook", r.id, None, "edited"
        opt = _option(db, slot, r.id)
        slot.why = list(body.why) if body.why is not None else list(opt.get("why") or [])
        if opt.get("ingredient_flags"):
            slot.ingredient_flags = dict(opt["ingredient_flags"])
        W.set_slot_cook(slot, r)
        if body.cook is not None:
            slot.cook = _person_key(db, body.cook)
        db.execute(delete(m.QueueEntry).where(m.QueueEntry.recipe_id == r.id))
        W.reset_votes(db, slot, who, actor_up=True)
        if jobs is not None and P.needs_fill(r):
            P.enqueue_fill(db, jobs, r, slot, who, main=opt.get("main"), why=slot.why)
        return
    if body.kind == "text":
        if not (body.text or "").strip():
            raise HTTPException(status_code=422, detail="text is required")
        slot.kind, slot.recipe_id, slot.text, slot.status = "custom", None, body.text.strip(), "edited"
    elif body.kind == "leftover":
        slot.kind, slot.recipe_id, slot.text, slot.status = "leftover", None, body.text or "Leftovers", None
    elif body.kind == "leidy":
        r = _recipe(db, body.recipe_id) if body.recipe_id is not None else None
        slot.kind, slot.recipe_id = "leidy", r.id if r else None
        slot.text = body.text or (f"{r.title} (Leidy)" if r else "Leidy cooks")
        slot.status = "edited" if r else None
        W.set_slot_cook(slot, r)
        if body.cook:
            slot.cook = _person_key(db, body.cook)
    elif body.kind == "open":
        slot.kind, slot.recipe_id, slot.text, slot.status = "open", None, body.text, None
    if body.kind in ("text", "leftover", "open"):
        slot.cook = None
    slot.why = list(body.why) if body.why is not None else []
    W.reset_votes(db, slot, who)


@router.post("/{slot_id}/swap", response_model=s.Week, operation_id="swapSlot")
def swap(slot_id: int, body: s.SwapRequest, db: DB, who: User, jobs: Jobs) -> s.Week:
    slot = W.get_slot(db, slot_id)
    apply_swap(db, slot, who, body, jobs=jobs)
    return W.week_out(db, slot.week)


@router.post("/{slot_id}/swap-options", response_model=s.JobAccepted, status_code=202, operation_id="swapOptions")
def swap_options(slot_id: int, body: s.SwapOptionsRequest, db: DB, who: User, jobs: Jobs) -> s.JobAccepted:
    slot = W.get_slot(db, slot_id)
    # A newer ask supersedes older ones for this night: one worker, so they would only queue up.
    for old in db.scalars(select(m.Job).where(m.Job.type == J.SWAP_OPTIONS, m.Job.status.in_(J.ACTIVE))):
        if (old.payload or {}).get("slot_id") == slot.id:
            jobs.cancel(db, old)
    job = jobs.enqueue(db, J.SWAP_OPTIONS, {"slot_id": slot.id, "week_id": slot.week_id,
                                            "prefs": body.prefs, "text": body.text}, who)
    slot.job_id = job.id
    return s.JobAccepted(job=s.Job.model_validate(job))


@router.post("/{slot_id}/reject", response_model=s.RejectResponse, operation_id="rejectSlot")
def reject(slot_id: int, body: s.RejectRequest, db: DB, who: User, jobs: Jobs) -> s.RejectResponse:
    slot = W.get_slot(db, slot_id)
    old_recipe = slot.recipe_id
    basis = " · ".join([*body.reasons, *([body.note.strip()] if body.note and body.note.strip() else [])])
    fb = m.Feedback(kind="rejection", recipe_id=old_recipe, text=body.note, reasons=body.reasons,
                    remember=body.remember, who=who)
    db.add(fb)
    db.flush()
    job = None
    if body.mode == "open":
        slot.kind, slot.recipe_id, slot.text, slot.status = "open", None, None, "rejected"
        slot.cook = None
        slot.by, slot.basis, slot.why, slot.ingredients_override = who, basis or None, [], None
        slot.job_id = None
        slot.votes.clear()
    else:
        slot.status = "thinking"
        slot.basis = basis or None
        job = jobs.enqueue(db, J.REPLACEMENT, {
            "slot_id": slot.id, "week_id": slot.week_id, "feedback_id": fb.id,
            "rejected_recipe_id": old_recipe, "reasons": body.reasons, "note": body.note,
        }, who)
        slot.job_id = job.id
    week = W.week_out(db, slot.week)
    return s.RejectResponse(week=week, feedback_id=fb.id,
                            job=s.Job.model_validate(job) if job is not None else None)


@router.post("/{slot_id}/move", response_model=s.Week, operation_id="moveSlot")
def move(slot_id: int, body: s.MoveRequest, db: DB, who: User) -> s.Week:
    a = W.get_slot(db, slot_id)
    week = a.week
    if a.day == body.to:
        return W.week_out(db, week)
    b = W.slot_by_day(week, body.to)
    from_day = a.day
    a.day = "tmp"
    db.flush()
    b.day = from_day
    db.flush()
    a.day = body.to
    if a.kind == "cook":
        a.status = "edited"
    a.by = who
    db.flush()
    W.reset_votes(db, a, who)
    W.reset_votes(db, b, who)
    return W.week_out(db, week)


@router.post("/{slot_id}/cook", response_model=s.Week, operation_id="setSlotCook")
def set_cook(slot_id: int, body: s.CookRequest, db: DB, who: User) -> s.Week:
    slot = W.get_slot(db, slot_id)
    slot.cook = _person_key(db, body.cook)
    return W.week_out(db, slot.week)


@router.patch("/{slot_id}", response_model=s.Week, operation_id="patchSlot")
def patch_slot(slot_id: int, body: s.SlotPatch, db: DB, who: User) -> s.Week:
    slot = W.get_slot(db, slot_id)
    if body.reset_ingredients:
        slot.ingredients_override = None
    elif body.ingredients is not None:
        slot.ingredients_override = [i.model_dump() for i in body.ingredients]
    if body.ingredient_flags is not None:
        slot.ingredient_flags = {k: v.model_dump() for k, v in body.ingredient_flags.items()}
    if slot.kind == "cook" and slot.status in ("suggested", "kept", "approved"):
        slot.status = "edited"
        slot.by = who
    return W.week_out(db, slot.week)
