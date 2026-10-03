"""API contract (BUILD_PLAN section 5).

Written first; the OpenAPI document generated from these models becomes
`frontend/src/api/types.ts`. Person references (`by`, `who`, `checked_by`,
`requested_by`, `approved_by`, `from`) are person keys: lauren | joe | leidy.
"""

from __future__ import annotations

import datetime as dt
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

# ---------------------------------------------------------------- enums

PersonKey = Literal["lauren", "joe", "leidy"]
Day = Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
DAYS: list[str] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
SlotKind = Literal["cook", "leftover", "leidy", "custom", "open"]
SlotStatus = Literal["suggested", "thinking", "kept", "edited", "approved", "rejected"]
VoteValue = Literal["up", "down"]
RecipeSource = Literal["imported", "ai", "manual"]
RecipeStatus = Literal["draft", "saved"]
RequestType = Literal["meal", "out"]
RequestStatus = Literal["new", "planned", "declined"]
PantryState = Literal["found", "unsure", "confirmed", "removed"]
JobStatus = Literal["queued", "running", "done", "failed", "resting"]
OrderVia = Literal["delivery", "pickup", "amazon", "share", "self"]
SectionKey = Literal["produce", "frozen", "meat", "dry", "dairy", "beverages"]
IngredientTag = Literal["have", "sale", "list"]
FeedbackKind = Literal["rejection", "rating", "preference"]


class Model(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# ---------------------------------------------------------------- people


class Person(Model):
    key: PersonKey
    name: str
    color: str


# ---------------------------------------------------------------- recipes


class Ingredient(Model):
    qty: str = ""
    unit: str = ""
    name: str
    group: str | None = None


class StepGroup(Model):
    group: str
    steps: list[str] = Field(default_factory=list, description="Markdown; quantities in **bold**.")


class RecipeSummary(Model):
    id: int
    title: str
    short_title: str | None = None
    description: str = ""
    method: str | None = None
    total_min: int | None = None
    cost_usd: float | None = None
    healthy: int | None = None
    delicious: int | None = None
    stars: int | None = None
    tags: list[str] = Field(default_factory=list)
    source: RecipeSource
    status: RecipeStatus
    last_made: date | None = None


class Recipe(RecipeSummary):
    prep_min: int | None = None
    cook_min: int | None = None
    ingredients: list[Ingredient] = Field(default_factory=list)
    steps: list[StepGroup] = Field(default_factory=list)
    leftovers: str | None = None
    created_at: datetime
    updated_at: datetime


class RecipeDetail(Recipe):
    on_week_days: list[Day] = Field(default_factory=list, description="Days of the current week using it.")
    in_queue: bool = False
    ratings: list[CookLogEntry] = Field(default_factory=list)


class RecipePatch(Model):
    title: str | None = None
    short_title: str | None = None
    description: str | None = None
    method: str | None = None
    prep_min: int | None = None
    cook_min: int | None = None
    total_min: int | None = None
    cost_usd: float | None = None
    healthy: int | None = Field(default=None, ge=0, le=10)
    delicious: int | None = Field(default=None, ge=0, le=10)
    stars: int | None = Field(default=None, ge=0, le=5)
    tags: list[str] | None = None
    ingredients: list[Ingredient] | None = None
    steps: list[StepGroup] | None = None
    leftovers: str | None = None


class RecipeCreate(Model):
    """Manual recipe entry (no AI). AI drafts go through POST /api/recipes/draft."""

    title: str
    short_title: str | None = None
    description: str = ""
    method: str | None = None
    prep_min: int | None = None
    cook_min: int | None = None
    total_min: int | None = None
    cost_usd: float | None = None
    healthy: int | None = Field(default=None, ge=0, le=10)
    delicious: int | None = Field(default=None, ge=0, le=10)
    stars: int | None = Field(default=None, ge=0, le=5)
    tags: list[str] = Field(default_factory=list)
    ingredients: list[Ingredient] = Field(default_factory=list)
    steps: list[StepGroup] = Field(default_factory=list)
    leftovers: str | None = None


class CookedRequest(Model):
    stars: int | None = Field(default=None, ge=1, le=5)
    date: dt.date | None = None
    note: str | None = None


class CookLogEntry(Model):
    id: int
    recipe_id: int
    date: dt.date
    stars: int | None = None
    who: PersonKey


class CookedResponse(Model):
    recipe: Recipe
    log: CookLogEntry


class RecipeDraftRequest(Model):
    mode: Literal["describe", "link", "photo", "paste"]
    text: str | None = None
    url: str | None = None
    photo_path: str | None = Field(default=None, description="Media-relative path of an uploaded photo.")


# ---------------------------------------------------------------- slots and weeks


class IngredientFlag(Model):
    have: bool = False
    sale: str | None = Field(default=None, description='Sale note, e.g. "$3.49/lb"; null if not on sale.')


class SlotIngredient(Ingredient):
    key: str
    tag: IngredientTag
    sale: str | None = None


class Slot(Model):
    id: int
    day: Day
    kind: SlotKind
    recipe_id: int | None = None
    recipe: Recipe | None = None
    text: str | None = None
    status: SlotStatus | None = None
    by: str | None = None
    basis: str | None = None
    why: list[str] = Field(default_factory=list)
    cook: str | None = None
    ingredient_flags: dict[str, IngredientFlag] = Field(default_factory=dict)
    ingredients: list[SlotIngredient] = Field(
        default_factory=list, description="Effective ingredients (week override or recipe) with tags."
    )
    ingredients_edited: bool = False
    votes: dict[str, VoteValue] = Field(default_factory=dict, description="person key -> up/down")


class Week(Model):
    id: int
    monday: date
    label: str = Field(description='"Week of August 24"')
    store: Store | None = None
    order_via: OrderVia
    approved_by: str | None = None
    approved_at: datetime | None = None
    slots: list[Slot]
    list_diff_count: int = 0


class VoteRequest(Model):
    value: VoteValue | None = Field(default=None, description="null clears your vote")


class SwapRequest(Model):
    kind: Literal["recipe", "text", "leftover", "leidy", "open"]
    recipe_id: int | None = None
    text: str | None = None
    basis: str | None = Field(default=None, description="What the person asked for, echoed in the UI.")
    cook: str | None = None


class SwapOptionsRequest(Model):
    prefs: list[str] = Field(default_factory=list)
    text: str | None = None


class RejectRequest(Model):
    reasons: list[str] = Field(default_factory=list)
    note: str | None = None
    remember: bool = False
    mode: Literal["open", "another"]


class RejectResponse(Model):
    week: Week
    feedback_id: int
    job: Job | None = None


class MoveRequest(Model):
    to: Day


class CookRequest(Model):
    cook: str | None = Field(default=None, description="Who cooks: a person key or free text.")


class SlotPatch(Model):
    """Meal-detail edits for this week only. Marks a cook slot as edited."""

    ingredients: list[Ingredient] | None = None
    ingredient_flags: dict[str, IngredientFlag] | None = None
    reset_ingredients: bool = False


class PlanRequest(Model):
    days: list[Day] | None = Field(default=None, description="Only these days; default: untouched days.")
    note: str | None = None


# ---------------------------------------------------------------- queue


class QueueItem(Model):
    id: int
    recipe: RecipeSummary
    by: PersonKey
    created_at: datetime


class QueueAddRequest(Model):
    recipe_id: int


# ---------------------------------------------------------------- requests (inbox)


class RequestOut(Model):
    id: int
    who: PersonKey
    type: RequestType
    text: str
    status: RequestStatus
    reply: str | None = None
    week_id: int | None = None
    created_at: datetime


class RequestCreate(Model):
    type: RequestType
    text: str = Field(min_length=1)


class RequestAnswer(Model):
    status: RequestStatus
    reply: str | None = None
    list_items: list[str] = Field(
        default_factory=list, description='Free-text items ("2 lbs apples") to add to this week\'s list.'
    )


class RequestCounts(Model):
    new: int
    total: int
    new_from: list[PersonKey] = Field(default_factory=list)


# ---------------------------------------------------------------- pantry


class PantryPhoto(Model):
    id: int
    url: str
    label: str | None = None
    uploaded_by: PersonKey
    read_at: datetime | None = None
    created_at: datetime
    item_count: int = 0


class PantryItem(Model):
    id: int
    area: str
    name: str
    qty: str | None = None
    state: PantryState
    note: str | None = None
    photo_id: int | None = None
    added_by: str | None = None


class PantryStatus(Model):
    last_photo_at: datetime | None = None
    photo_count: int = 0
    needs_review: int = Field(description="Items still found or unsure.")
    unsure: int = 0
    confirmed: int = 0
    confirmed_at: datetime | None = None
    done: bool = Field(description="True once someone confirmed the latest read.")


class Pantry(Model):
    photos: list[PantryPhoto]
    items: list[PantryItem]
    areas: list[str]
    status: PantryStatus


class PantryItemPatch(Model):
    area: str | None = None
    name: str | None = None
    qty: str | None = None
    state: PantryState | None = None
    note: str | None = None


class PantryItemCreate(Model):
    area: str
    name: str = Field(min_length=1)
    qty: str | None = None
    note: str | None = None


class PantryReadRequest(Model):
    photo_ids: list[int] | None = Field(default=None, description="Default: photos not read yet.")


# ---------------------------------------------------------------- staples


class StapleOut(Model):
    id: int
    name: str
    section: SectionKey
    from_: str | None = Field(default=None, alias="from")
    active: bool


class StapleCreate(Model):
    name: str = Field(min_length=1)
    section: SectionKey | None = None


class StaplePatch(Model):
    name: str | None = None
    section: SectionKey | None = None
    active: bool | None = None


# ---------------------------------------------------------------- grocery list


class ListSource(Model):
    slot_id: int
    day: Day
    recipe_id: int
    title: str


class ListItem(Model):
    key: str = Field(description="Stable key: normalized name, or add-<id> for quick adds.")
    name: str
    qty: str | None = None
    section: SectionKey
    note: str | None = None
    sources: list[ListSource] = Field(default_factory=list)
    sale: str | None = None
    staple: bool = False
    from_: str | None = Field(default=None, alias="from")
    added: bool = False
    edited: bool = False
    checked: bool = False
    checked_by: str | None = None


class Section(Model):
    key: SectionKey
    name: str = Field(description="Exact CLAUDE.md section name.")
    label: str = Field(description="Short display label.")
    icon: str
    items: list[ListItem]


class ListDiffItem(Model):
    change: Literal["added", "removed", "changed"]
    key: str
    name: str
    section: SectionKey
    qty: str | None = None
    previous_qty: str | None = None


class GroceryList(Model):
    monday: date
    approved: bool
    approved_by: str | None = None
    approved_at: datetime | None = None
    sections: list[Section]
    diff: list[ListDiffItem]
    total: int
    unchecked: int


class ListItemCreate(Model):
    text: str = Field(min_length=1, description='Free text such as "2 lbs apples".')
    section: SectionKey | None = Field(default=None, description="Force an aisle; default auto-files it.")
    note: str | None = None


class ListItemPatch(Model):
    qty: str | None = None
    name: str | None = None
    note: str | None = None
    section: SectionKey | None = None


class CheckRequest(Model):
    checked: bool | None = Field(default=None, description="null toggles")


class ListStatus(Model):
    approved: bool
    diff_count: int
    total: int
    unchecked: int


# ---------------------------------------------------------------- stores and deals


class Store(Model):
    id: int
    key: str
    name: str
    ads_url: str | None = None
    instacart_retailer_key: str | None = None
    deal_count: int = 0
    ad_from: date | None = None
    ad_to: date | None = None


class WeekStoreRequest(Model):
    store_key: str


class OrderViaRequest(Model):
    order_via: OrderVia


class StoreChangeResponse(Model):
    week: Week
    notice: str | None = Field(default=None, description="e.g. 'Switched ads to Amazon Fresh'")
    job: Job | None = None


class Deal(Model):
    id: int
    store_id: int
    store_key: str
    valid_from: date | None = None
    valid_to: date | None = None
    item: str
    price: str
    unit: str | None = None
    section: SectionKey
    source_image: str | None = None


class AdUploadResponse(Model):
    files: list[str] = Field(description="Media URLs of the stored ad images.")
    job: Job


# ---------------------------------------------------------------- chat


class ChatProposal(Model):
    day: Day
    recipe_id: int | None = None
    text: str | None = None
    label: str
    detail: str | None = None
    state: Literal["pending", "applied", "dismissed"] = "pending"


class ChatMessageOut(Model):
    id: int
    who: PersonKey
    from_: Literal["me", "cafe"] = Field(alias="from")
    text: str
    proposal: ChatProposal | None = None
    week_id: int | None = None
    created_at: datetime


class ChatSend(Model):
    text: str = Field(min_length=1)


class ChatSendResponse(Model):
    message: ChatMessageOut
    job: Job


class ProposalAction(Model):
    action: Literal["apply", "dismiss"]


class ProposalResponse(Model):
    message: ChatMessageOut
    week: Week


# ---------------------------------------------------------------- jobs


class Job(Model):
    id: int
    type: str
    status: JobStatus
    payload: dict[str, Any] = Field(default_factory=dict)
    result: Any | None = None
    error: str | None = None
    requested_by: str | None = None
    created_at: datetime
    updated_at: datetime


class JobAccepted(Model):
    job: Job


# ---------------------------------------------------------------- settings and health


class AppSettings(Model):
    prep_day: Day = "sat"
    prep_time: str = Field(default="07:00", description="HH:MM, local time")
    leidy_nights: list[Day] = Field(default_factory=lambda: ["thu"])
    household_size: int = 5
    cook_nights_target: int = 5
    default_store: str = "cermak"
    default_order_via: OrderVia = "delivery"
    models: dict[str, str] = Field(default_factory=dict)


class AppSettingsUpdate(Model):
    prep_day: Day | None = None
    prep_time: str | None = Field(default=None, pattern=r"^\d{2}:\d{2}$")
    leidy_nights: list[Day] | None = None
    household_size: int | None = Field(default=None, ge=1, le=20)
    cook_nights_target: int | None = Field(default=None, ge=0, le=7)
    default_store: str | None = None
    default_order_via: OrderVia | None = None
    models: dict[str, str] | None = None


class Health(Model):
    ok: bool
    database: bool
    ai_mode: Literal["fake", "claude"]
    claude_token: Literal["present", "missing"]
    instacart_key: bool
    last_prep_run: datetime | None = None
    worker_running: bool
    version: str


# ---------------------------------------------------------------- bootstrap


class AppState(Model):
    me: Person
    people: list[Person]
    week: Week
    queue: list[QueueItem]
    requests: RequestCounts
    pantry: PantryStatus
    list: ListStatus
    jobs: list[Job] = Field(description="Queued and running jobs.")
    stores: list[Store]


class Ok(Model):
    ok: bool = True


for _m in list(globals().values()):
    if isinstance(_m, type) and issubclass(_m, BaseModel) and _m is not BaseModel:
        _m.model_rebuild()
