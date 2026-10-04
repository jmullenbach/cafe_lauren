"""Week helpers: current week, creation, serialization, vote rules, settings."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models as m
from .. import schemas as s
from . import grocery

DAYS = s.DAYS

DEFAULT_SETTINGS: dict[str, Any] = s.AppSettings(
    models={
        "plan": "claude-sonnet-5-5",
        "swap": "claude-sonnet-5-5",
        "replacement": "claude-sonnet-5-5",
        "pantry": "claude-sonnet-5-5",
        "ads": "claude-sonnet-5-5",
        "recipe": "claude-sonnet-5-5",
        "chat": "claude-sonnet-5-5",
    }
).model_dump()


# ---------------------------------------------------------------- dates


def today(tz: str = "America/Chicago") -> date:
    try:
        return datetime.now(ZoneInfo(tz)).date()
    except Exception:  # pragma: no cover - missing tzdata
        return date.today()


def monday_of(d: date) -> date:
    return d - timedelta(days=d.weekday())


def week_label(monday: date) -> str:
    return f"Week of {monday.strftime('%B')} {monday.day}"


def require_monday(d: date) -> date:
    if d.weekday() != 0:
        raise HTTPException(status_code=422, detail=f"{d.isoformat()} is not a Monday")
    return d


# ---------------------------------------------------------------- settings


def get_setting(db: Session, key: str, default: Any = None) -> Any:
    row = db.scalar(select(m.Setting).where(m.Setting.key == key))
    return row.value if row is not None else DEFAULT_SETTINGS.get(key, default)


def set_setting(db: Session, key: str, value: Any) -> None:
    row = db.scalar(select(m.Setting).where(m.Setting.key == key))
    if row is None:
        db.add(m.Setting(key=key, value=value))
    else:
        row.value = value


def all_settings(db: Session) -> s.AppSettings:
    data = dict(DEFAULT_SETTINGS)
    for row in db.scalars(select(m.Setting)):
        if row.key in data:
            data[row.key] = row.value
    return s.AppSettings.model_validate(data)


# ---------------------------------------------------------------- weeks


def get_or_create_week(db: Session, monday: date) -> m.Week:
    require_monday(monday)
    week = db.scalar(select(m.Week).where(m.Week.monday == monday))
    if week is not None:
        return week
    store_key = get_setting(db, "default_store", "cermak")
    store = db.scalar(select(m.Store).where(m.Store.key == store_key))
    week = m.Week(monday=monday, store_id=store.id if store else None,
                  order_via=get_setting(db, "default_order_via", "delivery"))
    db.add(week)
    db.flush()
    for d in DAYS:
        db.add(m.Slot(week_id=week.id, day=d, kind="open", why=[], ingredient_flags={}))
    db.flush()
    db.refresh(week)
    return week


def current_week(db: Session, tz: str) -> m.Week:
    return get_or_create_week(db, monday_of(today(tz)))


def get_slot(db: Session, slot_id: int) -> m.Slot:
    slot = db.get(m.Slot, slot_id)
    if slot is None:
        raise HTTPException(status_code=404, detail="Slot not found")
    return slot


def slot_by_day(week: m.Week, day: str) -> m.Slot:
    for sl in week.slots:
        if sl.day == day:
            return sl
    raise HTTPException(status_code=404, detail=f"No slot for {day}")


# ---------------------------------------------------------------- votes


def set_vote(db: Session, slot: m.Slot, person: str, value: str | None) -> None:
    existing = next((v for v in slot.votes if v.person == person), None)
    if value is None:
        if existing is not None:
            slot.votes.remove(existing)
    elif existing is None:
        slot.votes.append(m.Vote(person=person, value=value))
    else:
        existing.value = value
    db.flush()


def set_slot_cook(slot: m.Slot, recipe: m.Recipe | None) -> None:
    """The one rule for who cooks a night when a meal is placed: a Leidy night is Leidy's,
    a cook night takes the recipe's default, anything else has no cook."""
    if slot.kind == "leidy":
        slot.cook = "leidy"
    elif slot.kind == "cook" and recipe is not None:
        slot.cook = recipe.default_cook
    else:
        slot.cook = None


def reset_votes(db: Session, slot: m.Slot, actor: str, actor_up: bool = False) -> None:
    """Swap/move rule: clear the slot's votes except the acting person's up vote.

    `actor_up=True` gives the actor an up vote even if they had none (swapping
    in a meal you chose counts as wanting it, as in store.jsx).
    """
    keep_up = actor_up or any(v.person == actor and v.value == "up" for v in slot.votes)
    slot.votes.clear()
    db.flush()
    if keep_up:
        slot.votes.append(m.Vote(person=actor, value="up"))
    db.flush()


# ---------------------------------------------------------------- serialization


def recipe_out(r: m.Recipe) -> dict[str, Any]:
    return s.Recipe.model_validate(r).model_dump()


def slot_ingredients_out(slot: m.Slot) -> list[dict[str, Any]]:
    flags = slot.ingredient_flags or {}
    out = []
    for ing in grocery.slot_ingredients(slot):
        k = grocery.item_key(ing.get("name", ""))
        f = flags.get(k) or {}
        tag = "have" if f.get("have") else ("sale" if f.get("sale") else "list")
        out.append({"qty": ing.get("qty", ""), "unit": ing.get("unit", ""), "name": ing.get("name", ""),
                    "group": ing.get("group"), "key": k, "tag": tag, "sale": f.get("sale")})
    return out


def slot_out(slot: m.Slot) -> dict[str, Any]:
    return {
        "id": slot.id, "day": slot.day, "kind": slot.kind, "recipe_id": slot.recipe_id,
        "recipe": recipe_out(slot.recipe) if slot.recipe else None, "text": slot.text,
        "status": slot.status, "by": slot.by, "basis": slot.basis, "why": slot.why or [],
        "cook": slot.cook, "job_id": slot.job_id, "ingredient_flags": slot.ingredient_flags or {},
        "ingredients": slot_ingredients_out(slot),
        "ingredients_edited": slot.ingredients_override is not None,
        "votes": {v.person: v.value for v in slot.votes},
    }


def store_out(db: Session, store: m.Store, on: date | None = None) -> dict[str, Any]:
    on = on or date.today()
    q = select(func.count(m.Deal.id), func.min(m.Deal.valid_from), func.max(m.Deal.valid_to)).where(
        m.Deal.store_id == store.id,
        (m.Deal.valid_to.is_(None)) | (m.Deal.valid_to >= on - timedelta(days=7)),
    )
    count, dfrom, dto = db.execute(q).one()
    return {"id": store.id, "key": store.key, "name": store.name, "ads_url": store.ads_url,
            "instacart_retailer_key": store.instacart_retailer_key, "deal_count": count or 0,
            "ad_from": dfrom, "ad_to": dto}


def week_out(db: Session, week: m.Week) -> s.Week:
    db.flush()
    db.refresh(week)
    slots = sorted(week.slots, key=lambda x: DAYS.index(x.day))
    return s.Week.model_validate({
        "id": week.id, "monday": week.monday, "label": week_label(week.monday),
        "store": store_out(db, week.store, week.monday) if week.store else None,
        "order_via": week.order_via, "approved_by": week.approved_by, "approved_at": week.approved_at,
        "slots": [slot_out(x) for x in slots],
        "list_diff_count": len(grocery.diff(db, week)),
    })


def touch_week(week: m.Week) -> None:
    week.updated_at = m.utcnow()
