"""Job handlers for every AI job type. Imported by main.create_app so they register.

Pattern for each: read what is needed in a short session, call the AI with no
session open (calls take seconds), then open a new session to store the result
as suggestions via services/planner.py.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from collections.abc import Awaitable
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, TypeVar

import httpx
from sqlalchemy import select

from .. import jobs as J
from .. import models as m
from .. import schemas as S
from ..jobs import JobContext, JobFailed, JobResting, registry
from ..services import ads as ads_service
from ..services import planner as P
from ..services import weeks as W
from . import schemas as A
from .client import AIResting, CafeAI, ClaudeAuthError, get_ai

log = logging.getLogger("cafe.ai.jobs")

T = TypeVar("T")
PANTRY_BATCH = 4
ADS_BATCH = 4
PAGE_TEXT_LIMIT = 30_000
TOKEN_STATUS_KEY = "claude_token_status"
TOO_LONG = "Café took too long. Try again."


# ---------------------------------------------------------------- shared


def ai_for(ctx: JobContext) -> CafeAI:
    with ctx.session() as db:
        models = W.get_setting(db, "models") or {}
    return get_ai(ctx.db.settings, models)


def record_token_status(ctx: JobContext, status: str, detail: str | None = None) -> None:
    with ctx.session() as db:
        W.set_setting(db, TOKEN_STATUS_KEY, {"status": status, "at": m.utcnow().isoformat(), "detail": detail})


async def guarded(ctx: JobContext, call: Awaitable[T]) -> T:
    """Map AI errors onto job states and keep the token status current for /api/health.

    Every call has a time limit (settings.ai_timeout for the job type). On timeout the call is
    cancelled, which closes the Claude CLI subprocess, and the job fails with a friendly message."""
    limit = ctx.db.settings.ai_timeout(ctx.type)
    try:
        out = await asyncio.wait_for(call, timeout=limit)
    except asyncio.TimeoutError:
        log.warning("job %s (%s) timed out after %.0f s", ctx.id, ctx.type, limit)
        raise JobFailed(TOO_LONG) from None
    except AIResting as e:
        raise JobResting(str(e)) from e
    except ClaudeAuthError as e:
        if "rejected" in str(e):
            record_token_status(ctx, "rejected", str(e))
        raise
    if ctx.db.settings.cafe_ai == "claude":
        with ctx.session() as db:
            cur = W.get_setting(db, TOKEN_STATUS_KEY) or {}
            if cur.get("status") != "ok":
                W.set_setting(db, TOKEN_STATUS_KEY, {"status": "ok", "at": m.utcnow().isoformat(), "detail": None})
    return out


def media_path(ctx: JobContext, rel: str) -> Path:
    root = ctx.db.settings.cafe_media_dir.resolve()
    p = (root / rel).resolve()
    if not p.is_relative_to(root) or not p.is_file():
        raise FileNotFoundError(f"Media file not found: {rel}")
    return p


# ---------------------------------------------------------------- plan week


@registry.handler(J.PLAN_WEEK)
async def plan_week(ctx: JobContext) -> dict[str, Any]:
    with ctx.session() as db:
        week = _week(db, ctx.payload)
        days = P.plannable_days(week, ctx.payload.get("days"))
        if not days:
            return {"week_id": week.id, "filled": [], "summary": "Every night is already decided."}
        pctx = P.plan_context(db, week, days, ctx.payload.get("note"))
    plan = await guarded(ctx, ai_for(ctx).plan_week(pctx))
    with ctx.session() as db:
        week = _week(db, ctx.payload)
        filled = P.apply_plan(db, week, plan, days)
        return {"week_id": week.id, "monday": week.monday.isoformat(), "filled": filled, "summary": plan.summary}


def _week(db, payload: dict[str, Any]) -> m.Week:
    week = db.get(m.Week, payload.get("week_id")) if payload.get("week_id") else None
    if week is None and payload.get("monday"):
        from datetime import date

        week = W.get_or_create_week(db, date.fromisoformat(payload["monday"]))
    if week is None:
        raise ValueError("Week not found")
    return week


# ---------------------------------------------------------------- swap options and replacement


@registry.handler(J.SWAP_OPTIONS)
async def swap_options(ctx: JobContext) -> dict[str, Any]:
    with ctx.session() as db:
        slot = W.get_slot(db, ctx.payload["slot_id"])
        sctx = P.swap_context(db, slot, list(ctx.payload.get("prefs") or []), ctx.payload.get("text"))
    options = await guarded(ctx, ai_for(ctx).swap_options(sctx))
    with ctx.session() as db:
        slot = W.get_slot(db, ctx.payload["slot_id"])
        return {"slot_id": slot.id, "day": slot.day, "options": P.swap_option_rows(db, slot, options)}


@registry.handler(J.REPLACEMENT)
async def replacement(ctx: JobContext) -> dict[str, Any]:
    with ctx.session() as db:
        slot = W.get_slot(db, ctx.payload["slot_id"])
        if slot.status != "thinking":
            return {"slot_id": slot.id, "applied": False, "reason": "The night changed before Café answered."}
        rctx = P.reject_context(db, slot, ctx.payload.get("rejected_recipe_id"),
                                list(ctx.payload.get("reasons") or []), ctx.payload.get("note"))
    pick = await guarded(ctx, ai_for(ctx).replacement(rctx))
    with ctx.session() as db:
        slot = W.get_slot(db, ctx.payload["slot_id"])
        r = P.apply_replacement(db, slot, pick)
        fill = None
        if P.needs_fill(r):
            fill = P.enqueue_fill(db, ctx.manager, r, slot, ctx.requested_by,
                                  main=[n.model_dump(mode="json") for n in pick.ingredients], why=pick.why)
        return {"slot_id": slot.id, "day": slot.day, "applied": r is not None, "recipe_id": slot.recipe_id,
                "fill_job_id": fill.id if fill else None}


# ---------------------------------------------------------------- recipe fill (a picked idea -> full recipe)


@registry.handler(J.RECIPE_FILL)
async def recipe_fill(ctx: JobContext) -> dict[str, Any]:
    rid = ctx.payload.get("recipe_id")
    main = list(ctx.payload.get("main") or [])
    with ctx.session() as db:
        r = db.get(m.Recipe, rid)
        if r is None:
            raise ValueError("Recipe not found")
        if r.detail_status == "complete" and r.ingredients:
            return {"recipe_id": r.id, "filled": False, "reason": "Already written."}
        fctx = P.fill_context(db, r, main, list(ctx.payload.get("why") or []))
    draft = await guarded(ctx, ai_for(ctx).fill_recipe(fctx))
    with ctx.session() as db:
        r = db.get(m.Recipe, rid)
        if r is None:
            raise ValueError("Recipe not found")
        slots = P.apply_fill(db, r, draft, main)
        return {"recipe_id": r.id, "filled": True, "title": r.title, "ingredients": len(r.ingredients),
                "slot_ids": slots}


def _fill_recipe_state(status: str):
    def hook(db, job: m.Job) -> None:
        r = db.get(m.Recipe, (job.payload or {}).get("recipe_id"))
        if r is not None and r.detail_status != "complete":
            r.detail_status = status
    return hook


registry.register(J.RECIPE_FILL, on_failure=_fill_recipe_state("failed"), on_resting=_fill_recipe_state("failed"),
                  on_retry=_fill_recipe_state("pending"))


# ---------------------------------------------------------------- recipe draft


class _Text(HTMLParser):
    SKIP = {"script", "style", "noscript", "svg", "nav", "footer", "header", "form"}

    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.ld: list[str] = []
        self._skip = 0
        self._ld = False

    def handle_starttag(self, tag, attrs):
        if tag == "script" and dict(attrs).get("type") == "application/ld+json":
            self._ld = True
        if tag in self.SKIP:
            self._skip += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP and self._skip:
            self._skip -= 1
        if tag == "script":
            self._ld = False

    def handle_data(self, data):
        if self._ld:
            self.ld.append(data)
        elif not self._skip and data.strip():
            self.parts.append(data.strip())


def _find_recipe(node: Any) -> dict[str, Any] | None:
    if isinstance(node, list):
        return next((r for r in (_find_recipe(x) for x in node) if r), None)
    if isinstance(node, dict):
        t = node.get("@type")
        if t == "Recipe" or (isinstance(t, list) and "Recipe" in t):
            return node
        return _find_recipe(node.get("@graph")) if "@graph" in node else None
    return None


def page_text(html: str) -> str:
    """Readable text of a recipe page: its schema.org Recipe (if any) plus visible text."""
    p = _Text()
    p.feed(html)
    out = []
    for blob in p.ld:
        try:
            r = _find_recipe(json.loads(blob))
        except ValueError:
            continue
        if r:
            keep = {k: r.get(k) for k in ("name", "description", "recipeYield", "prepTime", "cookTime", "totalTime",
                                          "recipeIngredient", "recipeInstructions") if r.get(k)}
            out.append("Structured recipe data:\n" + json.dumps(keep, ensure_ascii=False)[:PAGE_TEXT_LIMIT // 2])
            break
    text = re.sub(r"\s+", " ", " ".join(p.parts))
    out.append("Page text:\n" + text)
    return "\n\n".join(out)[:PAGE_TEXT_LIMIT]


async def fetch_page(url: str) -> str:
    async with httpx.AsyncClient(timeout=20, follow_redirects=True,
                                 headers={"User-Agent": ads_service.USER_AGENT}) as c:
        r = await c.get(url)
        r.raise_for_status()
        return r.text


@registry.handler(J.RECIPE_DRAFT)
async def recipe_draft(ctx: JobContext) -> dict[str, Any]:
    p = ctx.payload
    mode = p.get("mode", "describe")
    with ctx.session() as db:
        household = W.get_setting(db, "household_size", 5)
    src = A.RecipeSource(mode=mode, text=p.get("text"), url=p.get("url"), household_size=household)
    if mode == "link":
        if not p.get("url"):
            raise ValueError("A link is needed")
        src.page_text = page_text(await fetch_page(p["url"]))
    elif mode == "photo":
        if not p.get("photo_path"):
            raise ValueError("A photo is needed")
        src.photo = media_path(ctx, p["photo_path"])
    elif not (p.get("text") or "").strip():
        raise ValueError("Describe the recipe or paste it")
    draft = await guarded(ctx, ai_for(ctx).draft_recipe(src))
    with ctx.session() as db:
        r = P.recipe_from_draft(db, draft)
        return S.RecipeDraftResult(recipe_id=r.id, title=r.title, status=r.status).model_dump()


# ---------------------------------------------------------------- pantry


@registry.handler(J.PANTRY_READ)
async def pantry_read(ctx: JobContext) -> dict[str, Any]:
    ids = list(ctx.payload.get("photo_ids") or [])
    with ctx.session() as db:
        photos = [(p.id, p.path) for p in db.scalars(select(m.PantryPhoto).where(m.PantryPhoto.id.in_(ids))
                                                    .order_by(m.PantryPhoto.id))]
    if not photos:
        return {"items": 0, "photos": 0, "message": "No new photos to read."}
    ai = ai_for(ctx)
    created: list[int] = []
    for start in range(0, len(photos), PANTRY_BATCH):
        batch = photos[start:start + PANTRY_BATCH]
        paths = [media_path(ctx, rel) for _id, rel in batch]
        reads = await guarded(ctx, ai.read_pantry(paths))
        with ctx.session() as db:
            rows = [db.get(m.PantryPhoto, pid) for pid, _ in batch]
            created += P.store_pantry_reads(db, [r for r in rows if r is not None], reads)
        await ctx.progress({"photos_read": start + len(batch), "photos": len(photos)})
    with ctx.session() as db:
        states = [db.get(m.PantryItem, i).state for i in created]
    return {"photos": len(photos), "items": len(created), "found": states.count("found"),
            "unsure": states.count("unsure")}


# ---------------------------------------------------------------- ads


async def read_ads_into_deals(ctx: JobContext, store_id: int, rel_paths: list[str], replace: str) -> dict[str, Any]:
    ai = ai_for(ctx)
    total = 0
    for start in range(0, len(rel_paths), ADS_BATCH):
        batch = rel_paths[start:start + ADS_BATCH]
        result = await guarded(ctx, ai.read_ads([media_path(ctx, r) for r in batch]))
        with ctx.session() as db:
            store = db.get(m.Store, store_id)
            today = W.today(ctx.db.settings.cafe_timezone)
            mode = replace if start == 0 else "none"
            total += P.store_deals(db, store, result, batch, today, mode)
    return {"store_id": store_id, "images": len(rel_paths), "deals": total}


@registry.handler(J.ADS_REFRESH)
async def ads_refresh(ctx: JobContext) -> dict[str, Any]:
    with ctx.session() as db:
        store = db.get(m.Store, ctx.payload["store_id"])
        if store is None:
            raise ValueError("Store not found")
        key, url, sid, name = store.key, store.ads_url, store.id, store.name
        on = W.today(ctx.db.settings.cafe_timezone)
        already = {Path(d.source_image).name for d in P.current_deals_for_store(db, sid, on) if d.source_image}
    try:
        paths = await ads_service.download(key, url, ctx.db.settings.cafe_media_dir, on=on)
    except ads_service.NoAdFetcher:
        return {"store_id": sid, "manual": True,
                "message": f"{name} has no automatic ad reader. Upload photos of the ad instead."}
    names = {Path(p).name for p in paths}
    if already and names <= already:
        return {"store_id": sid, "images": len(paths), "deals": 0, "skipped": "This ad was already read."}
    out = await read_ads_into_deals(ctx, sid, paths, "all")
    return {**out, "files": paths}


@registry.handler(J.ADS_READ)
async def ads_read(ctx: JobContext) -> dict[str, Any]:
    paths = list(ctx.payload.get("paths") or [])
    if not paths:
        return {"store_id": ctx.payload.get("store_id"), "images": 0, "deals": 0}
    return await read_ads_into_deals(ctx, ctx.payload["store_id"], paths, "other_uploads")


# ---------------------------------------------------------------- chat


@registry.handler(J.CHAT)
async def chat(ctx: JobContext) -> dict[str, Any]:
    with ctx.session() as db:
        asked = db.get(m.ChatMessage, ctx.payload["message_id"])
        if asked is None:
            raise ValueError("Message not found")
        week = db.get(m.Week, asked.week_id) if asked.week_id else None
        if week is None:
            raise ValueError("Message has no week")
        cctx = P.chat_context(db, week, asked.who, asked.text, before_id=asked.id)
    reply = await guarded(ctx, ai_for(ctx).chat(cctx))
    with ctx.session() as db:
        asked = db.get(m.ChatMessage, ctx.payload["message_id"])
        msg = P.store_chat_reply(db, asked, reply)
        return {"message_id": msg.id, "proposal": msg.proposal is not None}
