"""The one interface every Claude call goes through (BUILD_PLAN section 6).

`get_ai(settings)` returns `FakeCafeAI` (fixtures, no quota) or `ClaudeCafeAI`
(Claude Agent SDK on the owner's subscription token), chosen by `CAFE_AI`.

ClaudeCafeAI follows docs/SPIKE_RESULTS.md: one-shot `query()` with an explicit
system prompt, `tools=[]`, `setting_sources=[]`, `max_turns=3`, structured
output via `output_format`, images as base64 blocks in a streaming-input
message, and `ANTHROPIC_API_KEY` removed so the subscription token is used.
Errors are classified into resting (limit), auth (token rejected) or failed.
"""

from __future__ import annotations

import asyncio
import base64
import io
import json
import logging
import os
import re
import time
from collections.abc import AsyncIterator, Callable
from functools import lru_cache
from pathlib import Path
from typing import Any, Protocol, TypeVar

from pydantic import BaseModel, ValidationError

from . import schemas as A

log = logging.getLogger("cafe.ai")

PROMPTS = Path(__file__).parent / "prompts"
DEFAULT_MODEL = "claude-sonnet-5-5"
RESTING_TEXT = "Café is resting. Try again later."

# Protocol method -> key in the `models` setting.
MODEL_KEYS = {
    "plan_week": "plan", "swap_options": "swap", "replacement": "replacement", "read_pantry": "pantry",
    "read_ads": "ads", "draft_recipe": "recipe", "fill_recipe": "recipe", "chat": "chat",
}
PROMPT_FILES = {
    "plan_week": "plan_week", "swap_options": "swap_options", "replacement": "replacement",
    "read_pantry": "pantry_read", "read_ads": "ads_read", "draft_recipe": "recipe_draft",
    "fill_recipe": "recipe_fill", "chat": "chat",
}

T = TypeVar("T", bound=BaseModel)


# ---------------------------------------------------------------- errors


class AIError(Exception):
    """An AI call failed for a reason other than limits or auth (job -> failed)."""


class AIResting(AIError):
    """Subscription limit hit (job -> resting)."""

    def __init__(self, message: str = RESTING_TEXT, resets_at: int | None = None):
        super().__init__(message)
        self.resets_at = resets_at


class ClaudeAuthError(AIError):
    """Token missing or rejected. /api/health reports it."""


class AIOutputError(AIError):
    """The model's output failed validation twice."""


# ---------------------------------------------------------------- interface


class CafeAI(Protocol):
    async def plan_week(self, ctx: A.PlanContext) -> A.PlanSuggestion: ...
    async def swap_options(self, ctx: A.SwapContext) -> list[A.MealPick]: ...
    async def replacement(self, ctx: A.RejectContext) -> A.MealPick: ...
    async def fill_recipe(self, ctx: A.FillContext) -> A.RecipeDraft: ...
    async def read_pantry(self, photos: list[Path]) -> list[A.PantryRead]: ...
    async def read_ads(self, images: list[Path]) -> A.AdsReadResult: ...
    async def draft_recipe(self, src: A.RecipeSource) -> A.RecipeDraft: ...
    async def chat(self, ctx: A.ChatContext) -> A.ChatReply: ...


# ---------------------------------------------------------------- prompts and images


@lru_cache
def load_prompt(task: str) -> str:
    shared = (PROMPTS / "_household.md").read_text()
    return shared.strip() + "\n\n" + (PROMPTS / f"{PROMPT_FILES[task]}.md").read_text().strip() + "\n"


def context_text(ctx: BaseModel, lead: str) -> str:
    data = ctx.model_dump(mode="json", exclude_none=True)
    return f"{lead}\n\nHousehold data (JSON):\n```json\n{json.dumps(data, ensure_ascii=False, indent=1)}\n```"


def encode_image(path: Path, max_px: int = 1024) -> dict[str, Any]:
    """A base64 content block, resized so the long edge is at most `max_px`."""
    path = Path(path)
    if path.suffix.lower() == ".pdf":
        data = base64.b64encode(path.read_bytes()).decode()
        return {"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": data}}
    from PIL import Image, ImageOps

    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im)
            im.thumbnail((max_px, max_px))
            if im.mode not in ("RGB", "L"):
                im = im.convert("RGB")
            buf = io.BytesIO()
            im.save(buf, format="JPEG", quality=85)
    except Exception as e:  # noqa: BLE001 - unreadable image (HEIC without a plugin, corrupt file)
        raise AIError(f"Could not read image {path.name}: {e}") from e
    return {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                        "data": base64.b64encode(buf.getvalue()).decode()}}


# ---------------------------------------------------------------- error classification


def classify(assistant_error: str | None, rate_limit_events: list[Any], result: Any, exc: BaseException | None) -> str:
    """'ok' | 'resting' | 'auth' | 'failed' (SPIKE_RESULTS section 3)."""
    status = getattr(result, "api_error_status", None) or getattr(exc, "api_error_status", None)
    if assistant_error == "rate_limit" or status == 429:
        return "resting"
    if any(getattr(getattr(e, "rate_limit_info", None), "status", None) == "rejected" for e in rate_limit_events):
        return "resting"
    if assistant_error == "authentication_failed" or status in (401, 403):
        return "auth"
    if exc is not None or (result is not None and getattr(result, "is_error", False)):
        return "failed"
    return "ok"


def _scrub(text: str, token: str | None) -> str:
    text = text or ""
    if token:
        text = text.replace(token, "[token]")
    return re.sub(r"sk-ant-[A-Za-z0-9_\-]+", "[token]", text)[:500]


# ---------------------------------------------------------------- Claude


QueryFn = Callable[..., AsyncIterator[Any]]


class ClaudeCafeAI:
    """CafeAI over the Claude Agent SDK. Never logs or returns the token."""

    def __init__(self, token: str | None, models: dict[str, str] | None = None, *,
                 query_fn: QueryFn | None = None, timeout: float = 600.0, max_turns: int = 3):
        self._token = token
        self.models = dict(models or {})
        self._query_fn = query_fn
        self.timeout = timeout
        self.max_turns = max(3, max_turns)
        self.calls: list[dict[str, Any]] = []  # per-call stats, for the smoke script

    def __repr__(self) -> str:  # keep the token out of reprs and tracebacks
        return f"ClaudeCafeAI(models={self.models!r})"

    def model_for(self, task: str) -> str:
        return self.models.get(MODEL_KEYS[task]) or DEFAULT_MODEL

    # ---- one SDK call

    async def _raw(self, task: str, schema: dict[str, Any], content: list[dict[str, Any]]) -> Any:
        from claude_agent_sdk import AssistantMessage, ClaudeAgentOptions, RateLimitEvent, ResultMessage

        if not self._token:
            raise ClaudeAuthError("Claude token missing. Run `claude setup-token` and set CLAUDE_CODE_OAUTH_TOKEN in .env.")
        os.environ.pop("ANTHROPIC_API_KEY", None)  # it would take precedence over the subscription token
        query_fn = self._query_fn
        if query_fn is None:
            from claude_agent_sdk import query as query_fn
        opts = ClaudeAgentOptions(
            model=self.model_for(task), system_prompt=load_prompt(task), tools=[], max_turns=self.max_turns,
            setting_sources=[], output_format={"type": "json_schema", "schema": schema},
            env={"CLAUDE_CODE_OAUTH_TOKEN": self._token},
        )

        async def stream():
            yield {"type": "user", "parent_tool_use_id": None,
                   "message": {"role": "user", "content": content}}

        a_err: str | None = None
        events: list[Any] = []
        result: Any = None
        exc: BaseException | None = None
        t0 = time.monotonic()

        async def run() -> None:
            nonlocal a_err, result
            gen = query_fn(prompt=stream(), options=opts)
            try:
                async for msg in gen:
                    if isinstance(msg, AssistantMessage):
                        a_err = msg.error or a_err
                    elif isinstance(msg, RateLimitEvent):
                        events.append(msg)
                    elif isinstance(msg, ResultMessage):
                        result = msg
            finally:
                # `async for` does not close its generator when cancelled (a superseded job or a
                # timeout), so close it here: the SDK's own finally then tears the CLI subprocess down.
                aclose = getattr(gen, "aclose", None)
                if aclose is not None:
                    await aclose()

        try:
            await asyncio.wait_for(run(), timeout=self.timeout)
        except asyncio.TimeoutError:
            raise AIError(f"Claude did not answer within {int(self.timeout)} s") from None
        except Exception as e:  # noqa: BLE001 - classified below
            exc = e
        kind = classify(a_err, events, result, exc)
        self.calls.append({
            "task": task, "model": opts.model, "seconds": round(time.monotonic() - t0, 1), "outcome": kind,
            "turns": getattr(result, "num_turns", None), "cost_usd": getattr(result, "total_cost_usd", None),
        })
        if kind == "resting":
            resets = next((getattr(e.rate_limit_info, "resets_at", None) for e in events
                           if getattr(e.rate_limit_info, "status", None) == "rejected"), None)
            raise AIResting(RESTING_TEXT, resets)
        if kind == "auth":
            raise ClaudeAuthError("Claude token rejected. Run `claude setup-token` and update CLAUDE_CODE_OAUTH_TOKEN in .env.")
        if kind == "failed":
            detail = getattr(result, "result", None) or (str(exc) if exc else "") or "unknown error"
            raise AIError(f"Claude call failed: {_scrub(str(detail), self._token)}")
        return getattr(result, "structured_output", None)

    async def _call(self, task: str, model: type[T], content: list[dict[str, Any]]) -> T:
        """Run, validate with Pydantic, retry once on a validation failure."""
        schema = A.json_schema(model)
        problem = ""
        for attempt in range(2):
            blocks = content if attempt == 0 else [*content, {"type": "text", "text": (
                "Your previous answer did not match the required JSON schema:\n" + problem +
                "\nAnswer again, following the schema exactly.")}]
            data = await self._raw(task, schema, blocks)
            if isinstance(data, str):
                try:
                    data = json.loads(data)
                except ValueError:
                    pass
            if data is None:
                problem = "No structured output was returned."
                continue
            try:
                return model.model_validate(data)
            except ValidationError as e:
                problem = str(e)[:1500]
                log.warning("%s output failed validation (attempt %d): %s", task, attempt + 1, problem[:300])
        raise AIOutputError(f"Claude's answer for {task} did not validate after a retry: {problem[:300]}")

    # ---- tasks

    async def plan_week(self, ctx: A.PlanContext) -> A.PlanSuggestion:
        text = context_text(ctx, f"Suggest meals for these days of the week of {ctx.monday}: {', '.join(ctx.days)}.")
        return await self._call("plan_week", A.PlanSuggestion, [{"type": "text", "text": text}])

    async def swap_options(self, ctx: A.SwapContext) -> list[A.MealPick]:
        text = context_text(ctx, f"Give three options for {ctx.day}.")
        out = await self._call("swap_options", A.SwapOptions, [{"type": "text", "text": text}])
        return out.options

    async def replacement(self, ctx: A.RejectContext) -> A.MealPick:
        text = context_text(ctx, f"Suggest one replacement for {ctx.day}.")
        return await self._call("replacement", A.MealPick, [{"type": "text", "text": text}])

    async def fill_recipe(self, ctx: A.FillContext) -> A.RecipeDraft:
        text = context_text(ctx, f"Write the full recipe for {ctx.title}.")
        return await self._call("fill_recipe", A.RecipeDraft, [{"type": "text", "text": text}])

    async def read_pantry(self, photos: list[Path]) -> list[A.PantryRead]:
        blocks = [encode_image(p, 1024) for p in photos]
        blocks.append({"type": "text", "text": f"These are {len(photos)} photo(s), index 0 to {len(photos) - 1}. "
                                               "List the food items you can see."})
        return (await self._call("read_pantry", A.PantryReadResult, blocks)).items

    async def read_ads(self, images: list[Path]) -> A.AdsReadResult:
        from datetime import date

        blocks = [encode_image(p, 1568) for p in images]
        blocks.append({"type": "text", "text": f"Today is {date.today().isoformat()}. These are {len(images)} ad "
                                               f"image(s), index 0 to {len(images) - 1}. List every food deal."})
        return await self._call("read_ads", A.AdsReadResult, blocks)

    async def draft_recipe(self, src: A.RecipeSource) -> A.RecipeDraft:
        blocks: list[dict[str, Any]] = []
        if src.photo is not None:
            blocks.append(encode_image(src.photo, 1024))
        parts = [f"Source type: {src.mode}. Serve {src.household_size}."]
        if src.url:
            parts.append(f"Link: {src.url}")
        if src.text:
            parts.append(f"From the person:\n{src.text}")
        if src.page_text:
            parts.append(f"Text of the linked page:\n<page>\n{src.page_text}\n</page>")
        blocks.append({"type": "text", "text": "\n\n".join(parts)})
        return await self._call("draft_recipe", A.RecipeDraft, blocks)

    async def chat(self, ctx: A.ChatContext) -> A.ChatReply:
        text = context_text(ctx, f"{ctx.who} wrote: {ctx.message}")
        return await self._call("chat", A.ChatReply, [{"type": "text", "text": text}])


# ---------------------------------------------------------------- fake


class FakeCafeAI:
    """Fixtures from ui_kits/mobile/data.js (via seed_demo). No network, no quota.

    CAFE_FAKE_SWAP_DELAY / CAFE_FAKE_FILL_DELAY (seconds) slow swap_options / fill_recipe down, so
    end-to-end tests can see the thinking states and superseded asks."""

    # A new idea that is not in the demo data, so the swap sheet exercises "pick, then fill".
    IDEA = dict(title="Sheet Pan Sausage and Gnocchi", short_title="Sausage gnocchi",
                description="Crispy shelf-stable gnocchi roasted with smoked sausage, peppers and onion.",
                method="Sheet pan", total_min=30, cost_usd=16.0)
    IDEA_INGS = [("smoked sausage", False, "$2.99"), ("gnocchi", False, None), ("bell peppers", False, None),
                 ("red onion", True, None)]

    PLAN = {"mon": "tacos", "tue": "leftover:Taco leftovers → taco-salad bowls", "wed": "chops",
            "thu": "salmon", "fri": "shrimp", "sat": "chicken", "sun": "leftover:Chicken leftovers → wraps"}
    ALTERNATIVES = ["salmon", "stirfry", "meatballs", "soup"]

    def __init__(self) -> None:
        self.calls: list[dict[str, Any]] = []

    @staticmethod
    def _fx():
        from .. import seed_demo

        return seed_demo

    def _draft(self, key: str) -> A.RecipeDraft:
        fx = self._fx()
        d = fx.MEALS[key]
        ings = []
        for q, name, _tag in d["ings"]:
            qty, unit = fx._split_qty(q)
            ings.append(A.AIIngredient(qty=qty, unit=unit, name=name, group=None))
        steps = fx.STEPS.get(key) or [{"group": "Cook", "steps": [
            f"Prepare **{q} {name}**." for q, name, _t in d["ings"]]}]
        return A.RecipeDraft(
            title=d["title"], short_title=d["short"], description=d["description"], method=d["method"],
            prep_min=10, cook_min=max(0, d["total"] - 10), total_min=d["total"], cost_usd=float(d["cost"]),
            healthy=d["healthy"], delicious=d["delicious"], tags=[], ingredients=ings,
            steps=[A.AIStepGroup(**s) for s in steps], leftovers=d["leftovers"])

    def _meal(self, key: str, day: str, box: list[dict[str, Any]], why: list[str] | None = None) -> A.MealSuggestion:
        fx = self._fx()
        d = fx.MEALS[key]
        rid = next((r["id"] for r in box if r.get("title") == d["title"]), None)
        notes = [A.IngredientNote(name=name, have=tag == "have",
                                  sale=fx.SALE.get(name.lower(), "On sale") if tag == "sale" else None)
                 for _q, name, tag in d["ings"]]
        return A.MealSuggestion(day=day, kind="cook", recipe_id=rid, new_recipe=None if rid else self._draft(key),
                                text=None, why=why or list(d["why"]), ingredients=notes)

    async def plan_week(self, ctx: A.PlanContext) -> A.PlanSuggestion:
        self.calls.append({"task": "plan_week"})
        taken = {str(f.get("title")) for f in ctx.fixed}
        spare = [k for k in self.ALTERNATIVES if self._fx().MEALS[k]["title"] not in taken]
        out = []
        for day in ctx.days:
            if day in ctx.leidy_nights:
                out.append(A.MealSuggestion(day=day, kind="leidy", text="Leidy cooks", why=["Leidy's night"]))
                continue
            plan = self.PLAN[day]
            if plan.startswith("leftover:"):
                out.append(A.MealSuggestion(day=day, kind="leftover", text=plan.split(":", 1)[1],
                                            why=["Uses the night before's leftovers"]))
                continue
            key = plan
            if self._fx().MEALS[key]["title"] in taken and spare:
                key = spare.pop(0)
            taken.add(self._fx().MEALS[key]["title"])
            out.append(self._meal(key, day, ctx.recipe_box))
        return A.PlanSuggestion(slots=out, summary="Sale pork and chicken early in the week, shrimp on Friday.")

    def _pick(self, key: str, box: list[dict[str, Any]], why: list[str] | None = None) -> A.MealPick:
        """A light option: the recipe-box id if the meal is there, else a new idea (no ingredients or steps)."""
        fx = self._fx()
        d = fx.MEALS[key]
        rid = next((r["id"] for r in box if r.get("title") == d["title"]), None)
        notes = [A.IngredientNote(name=name, have=tag == "have",
                                  sale=fx.SALE.get(name.lower(), "On sale") if tag == "sale" else None)
                 for _q, name, tag in d["ings"]][:6]
        idea = None if rid else A.MealIdea(title=d["title"], short_title=d["short"], description=d["description"],
                                           method=d["method"], total_min=d["total"], cost_usd=float(d["cost"]))
        return A.MealPick(recipe_id=rid, idea=idea, why=why or list(d["why"]), ingredients=notes)

    def _idea_pick(self, why: list[str] | None = None) -> A.MealPick:
        return A.MealPick(recipe_id=None, idea=A.MealIdea(**self.IDEA),
                          why=why or ["Smoked sausage on sale, $2.99", "One pan, 30 min"],
                          ingredients=[A.IngredientNote(name=n, have=h, sale=s) for n, h, s in self.IDEA_INGS])

    async def swap_options(self, ctx: A.SwapContext) -> list[A.MealPick]:
        self.calls.append({"task": "swap_options", "ask": ctx.ask})
        delay = float(os.environ.get("CAFE_FAKE_SWAP_DELAY") or 0)
        if delay:
            await asyncio.sleep(delay)
        current = (ctx.current or {}).get("title")
        keys = [k for k in self.ALTERNATIVES if self._fx().MEALS[k]["title"] != current][:2]
        out = [self._pick(k, ctx.recipe_box) for k in keys]
        if current != self.IDEA["title"]:
            out.append(self._idea_pick())
        return out

    async def replacement(self, ctx: A.RejectContext) -> A.MealPick:
        self.calls.append({"task": "replacement"})
        rejected = (ctx.rejected or {}).get("title")
        key = next(k for k in ["stirfry", *self.ALTERNATIVES] if self._fx().MEALS[k]["title"] != rejected)
        said = [f"You said: {r}" for r in ctx.reasons[:1]] or ["Something different, as asked"]
        return self._pick(key, ctx.recipe_box, why=[*said, *self._fx().MEALS[key]["why"][:2]])

    async def fill_recipe(self, ctx: A.FillContext) -> A.RecipeDraft:
        self.calls.append({"task": "fill_recipe", "title": ctx.title})
        delay = float(os.environ.get("CAFE_FAKE_FILL_DELAY") or 0)
        if delay:
            await asyncio.sleep(delay)
        fx = self._fx()
        key = next((k for k, d in fx.MEALS.items() if d["title"] == ctx.title), None)
        if key is not None:
            return self._draft(key)
        names = [str(i.get("name")) for i in ctx.main_ingredients if i.get("name")] or ["chicken thighs"]
        total = ctx.total_min or 30
        return A.RecipeDraft(
            title=ctx.title, short_title=" ".join(ctx.title.split()[:2]), description=ctx.description,
            method=ctx.method or "Skillet", prep_min=10, cook_min=max(0, total - 10), total_min=total,
            cost_usd=float(ctx.cost_usd or 15), healthy=7, delicious=8, tags=[],
            ingredients=[A.AIIngredient(qty="1", unit="lb" if i == 0 else "", name=n) for i, n in enumerate(names)],
            steps=[A.AIStepGroup(group="Cook", steps=[f"Cook **1 lb {names[0]}** until done.",
                                                      *[f"Add **{n}** and toss." for n in names[1:]]])],
            leftovers="Day 2: wrap it in tortillas")

    async def read_pantry(self, photos: list[Path]) -> list[A.PantryRead]:
        self.calls.append({"task": "read_pantry", "photos": len(photos)})
        n = max(1, len(photos))
        return [A.PantryRead(photo=min(pi, n - 1), area=area, name=name, qty=qty, sure=sure, note=note)
                for area, name, qty, sure, note, pi in self._fx().PANTRY]

    async def read_ads(self, images: list[Path]) -> A.AdsReadResult:
        from .. import seed_demo
        from ..services.grocery import section_of

        self.calls.append({"task": "read_ads", "images": len(images)})
        n = max(1, len(images))
        deals = [A.Deal(item=item, price=price, unit=unit, section=section_of(item), image=i % n)
                 for i, (item, price, unit) in enumerate(seed_demo.DEALS["cermak"])]
        return A.AdsReadResult(valid_from=None, valid_to=None, deals=deals)

    async def draft_recipe(self, src: A.RecipeSource) -> A.RecipeDraft:
        self.calls.append({"task": "draft_recipe", "mode": src.mode})
        d = self._draft("chops")
        hint = (src.text or src.url or "").strip().splitlines()[0][:80] if (src.text or src.url) else ""
        if hint and src.mode in ("describe", "paste"):
            d.title = hint.title()
            d.short_title = " ".join(hint.split()[:3]).capitalize()
        return d

    async def chat(self, ctx: A.ChatContext) -> A.ChatReply:
        self.calls.append({"task": "chat"})
        low = ctx.message.lower()
        day = next((d for d, name in zip(A.Day.__args__, ["monday", "tuesday", "wednesday", "thursday", "friday",
                                                          "saturday", "sunday"]) if name in low), "thu")
        names = {"mon": "Monday", "tue": "Tuesday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday",
                 "sat": "Saturday", "sun": "Sunday"}
        meal = self._meal("tofu", day, ctx.recipe_box)
        proposal = A.ChatProposalOut(day=day, recipe_id=meal.recipe_id, new_recipe=meal.new_recipe, text=None,
                                     label=f"{names[day]} → Bok Choy and Tofu Stir Fry",
                                     detail="Vegetarian. Tofu, bok choy, garlic over rice. 25 min, ~$11.")
        lead = "Thursday is Leidy's night. If she's open to it, here's" if day in ctx.leidy_nights else "Here's"
        return A.ChatReply(text=f"{lead} an option that uses what's on sale. It replaces nothing until you apply it.",
                           proposal=proposal)


# ---------------------------------------------------------------- selection

_override: CafeAI | None = None


def set_ai(ai: CafeAI | None) -> None:
    """Tests and scripts: force a specific CafeAI (None restores normal selection)."""
    global _override
    _override = ai


def get_ai(settings: Any, models: dict[str, str] | None = None) -> CafeAI:
    """`CAFE_AI=fake|claude` picks the implementation; `models` comes from the settings table."""
    if _override is not None:
        return _override
    if getattr(settings, "cafe_ai", "fake") == "claude":
        return ClaudeCafeAI(settings.claude_code_oauth_token, models)
    return FakeCafeAI()
