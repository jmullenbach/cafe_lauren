"""Inputs and outputs of every AI task.

Outputs are Pydantic models; `json_schema(Model)` turns one into the flat JSON
schema passed to the Agent SDK as `output_format` (refs inlined, every property
required, no extra keys). Results are validated against the same model, and the
client retries once when validation fails.

Contexts (`PlanContext` and friends) are what `services/planner.py` assembles
from the database; the prompts render them as JSON.
"""

from __future__ import annotations

import copy
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Day = Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
SectionKey = Literal["produce", "frozen", "meat", "dry", "dairy", "beverages"]
MealKind = Literal["cook", "leftover", "leidy", "open"]
METHODS = ["Sheet pan", "Instant Pot", "Le Creuset", "Skillet", "Oven", "Grill", "Slow cooker", "No cook"]


class Out(BaseModel):
    model_config = ConfigDict(extra="ignore")


# ---------------------------------------------------------------- outputs


class AIIngredient(Out):
    qty: str = Field(description='Amount, e.g. "2.5" or "1/2"; empty if none.')
    unit: str = Field(description='Unit, e.g. "lbs", "can", "cloves"; empty if none.')
    name: str = Field(description='Ingredient name only, e.g. "boneless chicken thighs".')
    group: str | None = Field(default=None, description='Optional sub-list such as "Sauce"; null if none.')


class AIStepGroup(Out):
    group: str = Field(description='Descriptive heading, e.g. "Cook the Chicken".')
    steps: list[str] = Field(description="One action each. Every amount in **bold** inline.")


class RecipeDraft(Out):
    """A full recipe in the CLAUDE.md format, as structured fields."""

    title: str = Field(description="Title Case meal title.")
    short_title: str = Field(description='Two or three words for small cards, e.g. "Pork chops".')
    description: str = Field(description="One sentence.")
    method: str = Field(description="Sheet pan | Instant Pot | Le Creuset | Skillet (or another simple method).")
    prep_min: int
    cook_min: int
    total_min: int
    cost_usd: float = Field(description="Approximate cost for 5 people, in dollars.")
    healthy: int = Field(description="Healthiness 0-10.")
    delicious: int = Field(description="Deliciousness 0-10.")
    tags: list[str] = Field(default_factory=list, description='Short tags such as "Quick", "Instant Pot", "Vegetarian".')
    ingredients: list[AIIngredient]
    steps: list[AIStepGroup]
    leftovers: str = Field(description='Leftover ideas, e.g. "Day 2: shred into wraps with deli cheese".')

    @field_validator("healthy", "delicious")
    @classmethod
    def _rating(cls, v: int) -> int:
        return max(0, min(10, int(v)))

    @field_validator("ingredients")
    @classmethod
    def _has_ingredients(cls, v: list[AIIngredient]) -> list[AIIngredient]:
        if not v:
            raise ValueError("a recipe needs at least one ingredient")
        return v


class IngredientNote(Out):
    name: str = Field(description="Ingredient name exactly as in the recipe.")
    have: bool = Field(description="True only if a confirmed pantry item covers it.")
    sale: str | None = Field(default=None, description='Sale note from the deals, e.g. "$3.49/lb"; null if not on sale.')


class MealSuggestion(Out):
    day: Day
    kind: MealKind = Field(description="cook = a recipe; leftover = eat leftovers; leidy = Leidy cooks; open = leave empty.")
    recipe_id: int | None = Field(default=None, description="id of a recipe from the recipe box, or null.")
    new_recipe: RecipeDraft | None = Field(default=None, description="A full new recipe when recipe_id is null and kind is cook.")
    text: str | None = Field(default=None, description='Label for leftover/leidy/open nights, e.g. "Taco leftovers → taco-salad bowls".')
    why: list[str] = Field(default_factory=list, description="2-3 short reasons: sale prices, requests, pantry items, favorites.")
    ingredients: list[IngredientNote] = Field(default_factory=list, description="have/sale flags for this week, per ingredient.")

    @field_validator("why")
    @classmethod
    def _trim_why(cls, v: list[str]) -> list[str]:
        return [x.strip() for x in v if x and x.strip()][:4]


class PlanSuggestion(Out):
    slots: list[MealSuggestion] = Field(description="One entry per requested day, in day order.")
    summary: str = Field(description="One or two sentences on the shape of the week.")


class SwapOptions(Out):
    options: list[MealSuggestion] = Field(description="Exactly three different options for the night.")

    @field_validator("options")
    @classmethod
    def _three(cls, v: list[MealSuggestion]) -> list[MealSuggestion]:
        if len(v) < 1:
            raise ValueError("return three options")
        return v[:3]


class PantryRead(Out):
    photo: int = Field(description="0-based index of the photo the item is in.")
    area: str = Field(description="Fridge | Freezer | Pantry | Counter")
    name: str
    qty: str = Field(description='Rough amount, e.g. "1 bag", "~2 lbs", "half a jar".')
    sure: bool = Field(description="False when the label is unreadable or you are guessing.")
    note: str | None = Field(default=None, description="Where it is or why you are unsure; null if nothing to add.")


class PantryReadResult(Out):
    items: list[PantryRead]


class Deal(Out):
    item: str = Field(description='Product as printed, e.g. "Center Cut Pork Chops".')
    price: str = Field(description='Price as printed, e.g. "$2.29", "2/$5", "10/$1".')
    unit: str | None = Field(default=None, description='"lb", "ea", "oz" or null.')
    section: SectionKey
    image: int = Field(description="0-based index of the ad image it came from.")


class AdsReadResult(Out):
    valid_from: str | None = Field(default=None, description="YYYY-MM-DD if the ad shows dates, else null.")
    valid_to: str | None = Field(default=None, description="YYYY-MM-DD if the ad shows dates, else null.")
    deals: list[Deal]


class ChatProposalOut(Out):
    day: Day
    recipe_id: int | None = Field(default=None, description="Recipe box id, or null.")
    new_recipe: RecipeDraft | None = Field(default=None, description="Full new recipe if proposing something not in the box.")
    text: str | None = Field(default=None, description="Free-text meal (e.g. leftovers) when there is no recipe.")
    label: str = Field(description='Card title, e.g. "Thursday → Bok Choy and Tofu Stir Fry".')
    detail: str = Field(description="One line: why, time and cost.")


class ChatReply(Out):
    text: str = Field(description="A short reply in Café's voice.")
    proposal: ChatProposalOut | None = Field(default=None, description="A change to one night, or null. Never applied without the person.")


# ---------------------------------------------------------------- contexts (inputs)


class Ctx(BaseModel):
    model_config = ConfigDict(extra="allow")


class PlanContext(Ctx):
    monday: str
    days: list[Day] = Field(description="Days Café may fill.")
    fixed: list[dict[str, Any]] = Field(default_factory=list, description="Nights a person already decided.")
    household_size: int = 5
    cook_nights_target: int = 5
    leidy_nights: list[Day] = Field(default_factory=list)
    store: str | None = None
    deals: list[dict[str, Any]] = Field(default_factory=list)
    pantry: list[dict[str, Any]] = Field(default_factory=list)
    requests: list[dict[str, Any]] = Field(default_factory=list)
    queue: list[dict[str, Any]] = Field(default_factory=list)
    recipe_box: list[dict[str, Any]] = Field(default_factory=list)
    recent_weeks: list[dict[str, Any]] = Field(default_factory=list)
    feedback: list[dict[str, Any]] = Field(default_factory=list)
    note: str | None = None


class SwapContext(PlanContext):
    day: Day
    current: dict[str, Any] | None = None
    prefs: list[str] = Field(default_factory=list)
    ask: str | None = None


class RejectContext(PlanContext):
    day: Day
    rejected: dict[str, Any] | None = None
    reasons: list[str] = Field(default_factory=list)
    reject_note: str | None = None


class ChatContext(PlanContext):
    who: str
    message: str
    history: list[dict[str, str]] = Field(default_factory=list)
    week: list[dict[str, Any]] = Field(default_factory=list)


class RecipeSource(Ctx):
    mode: Literal["describe", "link", "photo", "paste"]
    text: str | None = None
    url: str | None = None
    page_text: str | None = Field(default=None, description="Text pulled from the linked page.")
    photo: Path | None = None
    household_size: int = 5


# ---------------------------------------------------------------- JSON schema


def json_schema(model: type[BaseModel]) -> dict[str, Any]:
    """Flat schema for structured output: refs inlined, all keys required, no extras."""
    raw = model.model_json_schema()
    defs = raw.pop("$defs", {})

    def walk(node: Any) -> Any:
        if isinstance(node, list):
            return [walk(x) for x in node]
        if not isinstance(node, dict):
            return node
        if "$ref" in node:
            name = node["$ref"].split("/")[-1]
            return walk(copy.deepcopy(defs[name]))
        # "title"/"default" are dropped as schema keywords, never as property names.
        out = {k: ({pk: walk(pv) for pk, pv in v.items()} if k == "properties" else walk(v))
               for k, v in node.items() if k not in ("title", "default")}
        if out.get("type") == "object" and "properties" in out:
            out["required"] = list(out["properties"].keys())
            out["additionalProperties"] = False
        return out

    return walk(raw)
