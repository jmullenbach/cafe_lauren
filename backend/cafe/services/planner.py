"""Builds AI context from the database and turns AI results into suggestions.

Nothing here writes AI output to live state. Results become:
  - slots with status `suggested` (by "cafe"), with why[] and ingredient_flags,
  - recipes with status `draft`, source `ai` (saved only through /save); swap and
    replacement ideas start with no ingredients or steps (detail_status `pending`)
    and a `recipe_fill` job writes them once the idea is picked,
  - pantry items with state `found` or `unsure`,
  - chat proposals with state `pending`,
  - deals rows (read from the store's ad).
Slots a person has kept, edited, approved, rejected or voted on are never touched.
"""

from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .. import models as m
from ..ai import schemas as A
from . import grocery
from . import weeks as W

CAFE = "cafe"
DAY_NAMES = {"mon": "Monday", "tue": "Tuesday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday",
             "sat": "Saturday", "sun": "Sunday"}
PERSON_STATUSES = {"kept", "edited", "approved", "rejected", "thinking"}
MAX_DEALS = 120


# ---------------------------------------------------------------- touched slots


def touched(slot: m.Slot) -> bool:
    """True when a person has acted on the slot, so Café must leave it alone."""
    if slot.status in PERSON_STATUSES or slot.votes:
        return True
    return slot.by not in (None, CAFE)


def plannable_days(week: m.Week, days: list[str] | None = None) -> list[str]:
    wanted = set(days) if days else set(W.DAYS)
    return [sl.day for sl in sorted(week.slots, key=lambda x: W.DAYS.index(x.day))
            if sl.day in wanted and not touched(sl)]


# ---------------------------------------------------------------- context


def _title(slot: m.Slot) -> str | None:
    return slot.recipe.title if slot.recipe else slot.text


def _ingredient_names(r: m.Recipe) -> list[str]:
    return [str(i.get("name", "")) for i in (r.ingredients or []) if i.get("name")]


def current_deals(db: Session, week: m.Week) -> list[m.Deal]:
    if week.store_id is None:
        return []
    return list(db.scalars(select(m.Deal).where(
        m.Deal.store_id == week.store_id,
        (m.Deal.valid_to.is_(None)) | (m.Deal.valid_to >= week.monday - timedelta(days=7)),
    ).order_by(m.Deal.id).limit(MAX_DEALS)))


def base_context(db: Session, week: m.Week) -> dict[str, Any]:
    cfg = W.all_settings(db)
    slots = sorted(week.slots, key=lambda x: W.DAYS.index(x.day))
    fixed = [{"day": sl.day, "kind": sl.kind, "title": _title(sl), "status": sl.status, "cook": sl.cook}
             for sl in slots if touched(sl)]
    recent = []
    for wk in db.scalars(select(m.Week).where(m.Week.monday < week.monday).order_by(m.Week.monday.desc()).limit(4)):
        meals = {sl.day: _title(sl) for sl in sorted(wk.slots, key=lambda x: W.DAYS.index(x.day))
                 if sl.kind != "open" and sl.status != "rejected" and _title(sl)}
        if meals:
            recent.append({"monday": wk.monday.isoformat(), "meals": meals})
    box = [{"id": r.id, "title": r.title, "stars": r.stars, "method": r.method, "total_min": r.total_min,
            "last_made": r.last_made.isoformat() if r.last_made else None, "default_cook": r.default_cook, "tags": r.tags or [],
            "ingredients": _ingredient_names(r)}
           for r in db.scalars(select(m.Recipe).where(m.Recipe.status == "saved").order_by(m.Recipe.id))]
    queue = [{"recipe_id": q.recipe_id, "title": q.recipe.title, "by": q.by}
             for q in db.scalars(select(m.QueueEntry).order_by(m.QueueEntry.id))]
    reqs = [{"who": r.who, "type": r.type, "text": r.text, "date": r.created_at.date().isoformat()}
            for r in db.scalars(select(m.Request).where(m.Request.status == "new").order_by(m.Request.id))]
    pantry = [{"area": p.area, "name": p.name, "qty": p.qty}
              for p in db.scalars(select(m.PantryItem).where(m.PantryItem.state == "confirmed").order_by(m.PantryItem.id))]
    deals = [{"item": d.item, "price": d.price, "unit": d.unit} for d in current_deals(db, week)]
    feedback = []
    for f in db.scalars(select(m.Feedback).where(m.Feedback.remember.is_(True)).order_by(m.Feedback.id)):
        r = db.get(m.Recipe, f.recipe_id) if f.recipe_id else None
        feedback.append({"kind": f.kind, "who": f.who, "recipe": r.title if r else None,
                         "reasons": f.reasons or [], "text": f.text})
    return dict(
        monday=week.monday.isoformat(), fixed=fixed, household_size=cfg.household_size,
        cook_nights_target=cfg.cook_nights_target, leidy_nights=list(cfg.leidy_nights),
        store=week.store.name if week.store else None, deals=deals, pantry=pantry, requests=reqs,
        queue=queue, recipe_box=box, recent_weeks=recent, feedback=feedback,
    )


def plan_context(db: Session, week: m.Week, days: list[str], note: str | None = None) -> A.PlanContext:
    return A.PlanContext(**base_context(db, week), days=days, note=note)


def _slot_meal(slot: m.Slot) -> dict[str, Any]:
    return {"kind": slot.kind, "title": _title(slot), "recipe_id": slot.recipe_id}


def swap_context(db: Session, slot: m.Slot, prefs: list[str], text: str | None) -> A.SwapContext:
    return A.SwapContext(**base_context(db, slot.week), days=[slot.day], day=slot.day,
                         current=_slot_meal(slot), prefs=prefs, ask=text)


def reject_context(db: Session, slot: m.Slot, rejected_recipe_id: int | None, reasons: list[str],
                   note: str | None) -> A.RejectContext:
    r = db.get(m.Recipe, rejected_recipe_id) if rejected_recipe_id else None
    rejected = {"recipe_id": r.id, "title": r.title} if r else _slot_meal(slot)
    return A.RejectContext(**base_context(db, slot.week), days=[slot.day], day=slot.day, rejected=rejected,
                           reasons=reasons, reject_note=note)


def chat_context(db: Session, week: m.Week, who: str, message: str, before_id: int | None = None) -> A.ChatContext:
    stmt = select(m.ChatMessage).where(m.ChatMessage.who == who, m.ChatMessage.week_id == week.id)
    if before_id is not None:
        stmt = stmt.where(m.ChatMessage.id < before_id)
    rows = list(db.scalars(stmt.order_by(m.ChatMessage.id.desc()).limit(20)))[::-1]
    history = [{"from": x.from_, "text": x.text} for x in rows]
    plan = [{"day": sl.day, "kind": sl.kind, "title": _title(sl), "status": sl.status, "cook": sl.cook}
            for sl in sorted(week.slots, key=lambda x: W.DAYS.index(x.day))]
    return A.ChatContext(**base_context(db, week), days=[], who=who, message=message, history=history, week=plan)


# ---------------------------------------------------------------- recipes


def recipe_from_draft(db: Session, d: A.RecipeDraft) -> m.Recipe:
    """Create a draft recipe (status=draft, source=ai), or reuse one with the same title."""
    existing = db.scalar(select(m.Recipe).where(m.Recipe.title.ilike(d.title.strip())))
    if existing is not None:
        return existing
    r = m.Recipe(
        title=d.title.strip(), short_title=(d.short_title or "").strip() or None, description=d.description,
        method=d.method, prep_min=d.prep_min, cook_min=d.cook_min, total_min=d.total_min,
        cost_usd=float(d.cost_usd), healthy=d.healthy, delicious=d.delicious, stars=None, tags=list(d.tags),
        ingredients=[{"qty": i.qty, "unit": i.unit, "name": i.name, "group": i.group} for i in d.ingredients],
        steps=[{"group": g.group, "steps": list(g.steps)} for g in d.steps], leftovers=d.leftovers,
        source="ai", status="draft",
    )
    db.add(r)
    db.flush()
    return r


def recipe_from_idea(db: Session, idea: A.MealIdea) -> m.Recipe:
    """A draft recipe with only the headline facts (detail_status=pending), or the one with the same title."""
    existing = db.scalar(select(m.Recipe).where(m.Recipe.title.ilike(idea.title.strip())))
    if existing is not None:
        return existing
    r = m.Recipe(
        title=idea.title.strip(), short_title=(idea.short_title or "").strip() or None, description=idea.description,
        method=idea.method, total_min=idea.total_min, cost_usd=float(idea.cost_usd), stars=None, tags=[],
        ingredients=[], steps=[], source="ai", status="draft", detail_status="pending",
    )
    db.add(r)
    db.flush()
    return r


def resolve_pick(db: Session, pick: A.MealPick) -> m.Recipe | None:
    if pick.recipe_id is not None:
        r = db.get(m.Recipe, pick.recipe_id)
        if r is not None:
            return r
    return recipe_from_idea(db, pick.idea) if pick.idea is not None else None


def needs_fill(r: m.Recipe | None) -> bool:
    return r is not None and r.detail_status != "complete"


def fill_context(db: Session, r: m.Recipe, main: list[dict[str, Any]] | None = None,
                 why: list[str] | None = None) -> A.FillContext:
    cfg = W.all_settings(db)
    pantry = [{"area": p.area, "name": p.name, "qty": p.qty}
              for p in db.scalars(select(m.PantryItem).where(m.PantryItem.state == "confirmed").order_by(m.PantryItem.id))]
    week = db.scalar(select(m.Week).join(m.Slot).where(m.Slot.recipe_id == r.id).order_by(m.Week.monday.desc()))
    deals = [{"item": d.item, "price": d.price, "unit": d.unit} for d in current_deals(db, week)] if week else []
    return A.FillContext(title=r.title, description=r.description or "", method=r.method, total_min=r.total_min,
                         cost_usd=r.cost_usd, main_ingredients=list(main or []), why=list(why or []),
                         household_size=cfg.household_size, pantry=pantry, deals=deals)


def apply_fill(db: Session, r: m.Recipe, d: A.RecipeDraft, main: list[dict[str, Any]] | None = None) -> list[int]:
    """Write a filled recipe's details (the idea's title stays), then refresh flags on slots using it."""
    r.short_title = r.short_title or (d.short_title or "").strip() or None
    r.description = r.description or d.description
    r.method = r.method or d.method
    r.prep_min, r.cook_min, r.total_min = d.prep_min, d.cook_min, d.total_min
    r.cost_usd = float(d.cost_usd) if d.cost_usd else r.cost_usd
    r.healthy, r.delicious = d.healthy, d.delicious
    r.tags = list(d.tags)
    r.ingredients = [{"qty": i.qty, "unit": i.unit, "name": i.name, "group": i.group} for i in d.ingredients]
    r.steps = [{"group": g.group, "steps": list(g.steps)} for g in d.steps]
    r.leftovers = d.leftovers
    r.detail_status = "complete"
    db.flush()
    notes = [A.IngredientNote(name=str(n.get("name", "")), have=bool(n.get("have")), sale=n.get("sale"))
             for n in (main or []) if n.get("name")]
    touched_ids = []
    for slot in db.scalars(select(m.Slot).where(m.Slot.recipe_id == r.id)):
        if slot.ingredients_override is None:
            flag_notes = notes or [A.IngredientNote(name=k, have=bool(v.get("have")), sale=v.get("sale"))
                                   for k, v in (slot.ingredient_flags or {}).items()]
            slot.ingredient_flags = ingredient_flags(db, slot.week, r, flag_notes)
            touched_ids.append(slot.id)
    db.flush()
    return touched_ids


def enqueue_fill(db: Session, manager: Any, r: m.Recipe, slot: m.Slot | None, who: str | None,
                 main: list[dict[str, Any]] | None = None, why: list[str] | None = None) -> m.Job:
    """Queue a recipe_fill for a picked idea (reusing one already queued or running for it)."""
    from .. import jobs as J

    active = next((j for j in db.scalars(select(m.Job).where(m.Job.type == J.RECIPE_FILL,
                                                              m.Job.status.in_(J.ACTIVE)))
                   if (j.payload or {}).get("recipe_id") == r.id), None)
    job = active or manager.enqueue(db, J.RECIPE_FILL, {
        "recipe_id": r.id, "slot_id": slot.id if slot else None, "main": list(main or []), "why": list(why or []),
    }, who)
    r.detail_status = "pending"
    if slot is not None:
        slot.job_id = job.id
    return job


def resolve_recipe(db: Session, recipe_id: int | None, new_recipe: A.RecipeDraft | None) -> m.Recipe | None:
    if recipe_id is not None:
        r = db.get(m.Recipe, recipe_id)
        if r is not None:
            return r
    if new_recipe is not None:
        return recipe_from_draft(db, new_recipe)
    return None


# ---------------------------------------------------------------- ingredient flags


def _words(s: str) -> set[str]:
    return set(grocery.item_key(s.replace("-", " ")).split())


def _deal_note(d: m.Deal) -> str:
    return f"{d.price}/{d.unit}" if d.unit and "/" not in d.price else d.price


def ingredient_flags(db: Session, week: m.Week, recipe: m.Recipe,
                     notes: list[A.IngredientNote]) -> dict[str, dict[str, Any]]:
    """Per-ingredient have/sale for this week: Café's notes, filled in from pantry and deals."""
    by_key = {grocery.item_key(n.name): n for n in notes}
    pantry = [_words(p.name) for p in db.scalars(select(m.PantryItem).where(m.PantryItem.state == "confirmed"))]
    deals = [(_words(d.item), d) for d in current_deals(db, week)]
    out: dict[str, dict[str, Any]] = {}
    # An idea not written out yet has no ingredients: flag its main items from Café's notes.
    ings = recipe.ingredients or [{"name": n.name} for n in notes]
    for ing in ings:
        name = str(ing.get("name", "")).strip()
        if not name:
            continue
        k = grocery.item_key(name)
        n = by_key.get(k)
        words = _words(name)
        have = n.have if n is not None else any(words and words <= p for p in pantry)
        sale = n.sale if n is not None and n.sale else None
        if sale is None and words:
            hit = next((d for dw, d in deals if words <= dw), None)
            sale = _deal_note(hit) if hit else None
        if have or sale:
            out[k] = {"have": bool(have), "sale": sale}
    return out


# ---------------------------------------------------------------- applying suggestions


def apply_suggestion(db: Session, slot: m.Slot, sug: A.MealSuggestion, *, keep_basis: bool = False) -> bool:
    """Write one suggestion into an untouched (or thinking) slot. Returns False if skipped."""
    recipe = None
    if sug.kind in ("cook", "leidy"):
        recipe = resolve_recipe(db, sug.recipe_id, sug.new_recipe)
        if recipe is None and sug.kind == "cook":
            return False
    slot.kind = sug.kind
    slot.recipe_id = recipe.id if recipe else None
    if sug.kind == "leidy":
        slot.text = f"{recipe.title} (Leidy)" if recipe else (sug.text or "Leidy cooks")
    else:
        slot.text = None if recipe else (sug.text or None)
    W.set_slot_cook(slot, recipe)
    slot.status = "suggested" if recipe else None
    slot.by = CAFE
    slot.why = list(sug.why)
    slot.ingredients_override = None
    if not keep_basis:
        slot.basis = None
    slot.ingredient_flags = ingredient_flags(db, slot.week, recipe, sug.ingredients) if recipe else {}
    slot.votes.clear()
    db.flush()
    return True


def apply_plan(db: Session, week: m.Week, plan: A.PlanSuggestion, days: list[str]) -> list[str]:
    """Fill only `days`, and only those still untouched now (a person may have acted meanwhile)."""
    allowed = set(plannable_days(week, days))
    filled = []
    for sug in plan.slots:
        if sug.day not in allowed:
            continue
        slot = W.slot_by_day(week, sug.day)
        if apply_suggestion(db, slot, sug):
            filled.append(sug.day)
            allowed.discard(sug.day)
    return filled


def _notes(pick: A.MealPick) -> list[dict[str, Any]]:
    return [n.model_dump(mode="json") for n in pick.ingredients]


def apply_replacement(db: Session, slot: m.Slot, pick: A.MealPick) -> m.Recipe | None:
    """Put a light replacement on a thinking slot. Returns the recipe (which may still need filling)."""
    if slot.status != "thinking":
        return None  # a person changed it while Café was thinking
    r = resolve_pick(db, pick)
    if r is None:
        slot.kind, slot.recipe_id, slot.status = "open", None, "rejected"
        return None
    slot.kind, slot.recipe_id, slot.text, slot.status, slot.by = "cook", r.id, None, "suggested", CAFE
    W.set_slot_cook(slot, r)
    slot.why = list(pick.why)
    slot.ingredients_override = None
    slot.ingredient_flags = ingredient_flags(db, slot.week, r, pick.ingredients)
    slot.votes.clear()
    db.flush()
    return r


def swap_option_rows(db: Session, slot: m.Slot, options: list[A.MealPick]) -> list[dict[str, Any]]:
    """Swap-sheet options. New ideas are stored as pending drafts so /swap can point at them."""
    out = []
    for o in options:
        r = resolve_pick(db, o)
        if r is None or r.id in {x["recipe_id"] for x in out}:
            continue
        out.append({
            "recipe_id": r.id, "title": r.title, "short_title": r.short_title, "description": r.description,
            "method": r.method, "total_min": r.total_min, "cost_usd": r.cost_usd, "status": r.status,
            "detail_status": r.detail_status, "why": list(o.why), "main": _notes(o),
            "ingredient_flags": ingredient_flags(db, slot.week, r, o.ingredients),
        })
    return out


# ---------------------------------------------------------------- pantry, deals, chat


AREAS = {"fridge": "Fridge", "freezer": "Freezer", "pantry": "Pantry", "counter": "Counter"}


def store_pantry_reads(db: Session, photos: list[m.PantryPhoto], reads: list[A.PantryRead]) -> list[int]:
    """Replace earlier unconfirmed reads of these photos with new found/unsure items."""
    ids = [p.id for p in photos]
    if ids:
        db.execute(delete(m.PantryItem).where(m.PantryItem.photo_id.in_(ids),
                                              m.PantryItem.state.in_(["found", "unsure"])))
    out = []
    for r in reads:
        photo = photos[r.photo] if 0 <= r.photo < len(photos) else (photos[0] if photos else None)
        it = m.PantryItem(area=AREAS.get(r.area.strip().lower(), r.area.strip().title() or "Pantry"),
                          name=r.name.strip(), qty=r.qty.strip(), state="found" if r.sure else "unsure",
                          note=r.note, photo_id=photo.id if photo else None, added_by=None)
        db.add(it)
        db.flush()
        out.append(it.id)
    now = m.utcnow()
    for p in photos:
        p.read_at = now
    db.flush()
    return out


def _parse_date(s: str | None) -> date | None:
    try:
        return date.fromisoformat(s) if s else None
    except ValueError:
        return None


def current_deals_for_store(db: Session, store_id: int, on: date) -> list[m.Deal]:
    return list(db.scalars(select(m.Deal).where(
        m.Deal.store_id == store_id, (m.Deal.valid_to.is_(None)) | (m.Deal.valid_to >= on))))


def store_deals(db: Session, store: m.Store, result: A.AdsReadResult, image_paths: list[str],
                today: date, replace: str = "none") -> int:
    """Add deals read from an ad. `replace`: "all" drops the store's current deals first
    (a fresh scrape); "other_uploads" drops current deals not from this upload's folder
    (a new manual ad, possibly sent page by page); "none" only adds."""
    if not result.deals:
        return 0
    vf = _parse_date(result.valid_from) or today
    vt = _parse_date(result.valid_to) or (vf + timedelta(days=6))
    if vt < vf or vt < today:
        vf, vt = today, today + timedelta(days=6)  # misread or last week's dates: treat as this week's ad
    if replace in ("all", "other_uploads"):
        folder = str(Path(image_paths[0]).parent) if image_paths else ""
        for d in current_deals_for_store(db, store.id, today):
            if replace == "all" or not (d.source_image or "").startswith(folder + "/"):
                db.delete(d)
        db.flush()
    seen: set[tuple[str, str]] = set()
    count = 0
    for d in result.deals:
        dkey = (grocery.item_key(d.item), d.price.strip())
        if dkey in seen:  # the same deal printed on two pages
            continue
        seen.add(dkey)
        count += 1
        src = image_paths[d.image] if 0 <= d.image < len(image_paths) else (image_paths[0] if image_paths else None)
        section = d.section if d.section in grocery.SECTION_KEYS else grocery.section_of(d.item)
        db.add(m.Deal(store_id=store.id, valid_from=vf, valid_to=vt, item=d.item.strip(), price=d.price.strip(),
                      unit=(d.unit or None), section=section, source_image=src))
    db.flush()
    return count


def store_chat_reply(db: Session, asked: m.ChatMessage, reply: A.ChatReply) -> m.ChatMessage:
    proposal = None
    p = reply.proposal
    if p is not None:
        r = resolve_recipe(db, p.recipe_id, p.new_recipe)
        text = None if r else (p.text or p.label)
        proposal = {"day": p.day, "recipe_id": r.id if r else None, "text": text, "label": p.label,
                    "detail": p.detail, "state": "pending"}
    msg = m.ChatMessage(who=asked.who, from_="cafe", text=reply.text.strip(), proposal=proposal,
                        week_id=asked.week_id)
    db.add(msg)
    db.flush()
    return msg
