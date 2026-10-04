"""SQLAlchemy models. Every table has id, created_at, updated_at (BUILD_PLAN section 4)."""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )


class Person(TimestampMixin, Base):
    __tablename__ = "people"
    key: Mapped[str] = mapped_column(String(20), unique=True)
    name: Mapped[str] = mapped_column(String(80))
    color: Mapped[str] = mapped_column(String(20))


class Recipe(TimestampMixin, Base):
    __tablename__ = "recipes"
    title: Mapped[str] = mapped_column(String(200))
    short_title: Mapped[str | None] = mapped_column(String(80), nullable=True)
    description: Mapped[str] = mapped_column(Text, default="")
    method: Mapped[str | None] = mapped_column(String(40), nullable=True)
    prep_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cook_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cost_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    healthy: Mapped[int | None] = mapped_column(Integer, nullable=True)
    delicious: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stars: Mapped[int | None] = mapped_column(Integer, nullable=True)
    default_cook: Mapped[str | None] = mapped_column(String(20), nullable=True)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    ingredients: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    steps: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    leftovers: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(20), default="manual")  # imported, ai, manual
    status: Mapped[str] = mapped_column(String(20), default="saved")  # draft, saved
    # complete, or pending/failed for a picked idea whose ingredients and steps a recipe_fill job writes.
    detail_status: Mapped[str] = mapped_column(String(12), default="complete", server_default="complete")
    last_made: Mapped[date | None] = mapped_column(Date, nullable=True)


class Store(TimestampMixin, Base):
    __tablename__ = "stores"
    key: Mapped[str] = mapped_column(String(40), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    ads_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    instacart_retailer_key: Mapped[str | None] = mapped_column(String(120), nullable=True)


class Week(TimestampMixin, Base):
    __tablename__ = "weeks"
    monday: Mapped[date] = mapped_column(Date, unique=True)
    store_id: Mapped[int | None] = mapped_column(ForeignKey("stores.id"), nullable=True)
    order_via: Mapped[str] = mapped_column(String(20), default="delivery")
    approved_by: Mapped[str | None] = mapped_column(String(20), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    approved_list: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    store: Mapped[Store | None] = relationship()
    slots: Mapped[list[Slot]] = relationship(
        back_populates="week", cascade="all, delete-orphan", order_by="Slot.id"
    )


class Slot(TimestampMixin, Base):
    __tablename__ = "slots"
    __table_args__ = (UniqueConstraint("week_id", "day", name="uq_slot_week_day"),)
    week_id: Mapped[int] = mapped_column(ForeignKey("weeks.id", ondelete="CASCADE"))
    day: Mapped[str] = mapped_column(String(8))  # mon..sun, or "extra" for Lunches & breakfast
    kind: Mapped[str] = mapped_column(String(12), default="open")  # cook, leftover, leidy, custom, open
    recipe_id: Mapped[int | None] = mapped_column(
        ForeignKey("recipes.id", ondelete="SET NULL"), nullable=True
    )
    text: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str | None] = mapped_column(String(12), nullable=True)
    by: Mapped[str | None] = mapped_column(String(40), nullable=True)
    basis: Mapped[str | None] = mapped_column(Text, nullable=True)
    why: Mapped[list[str]] = mapped_column(JSON, default=list)
    cook: Mapped[str | None] = mapped_column(String(40), nullable=True)
    ingredient_flags: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    # Latest slot-scoped job (reject replacement, swap options); kept after failure so the UI can retry.
    job_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # Per-week ingredient edits from Meal detail; null means "use the recipe's".
    ingredients_override: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)

    week: Mapped[Week] = relationship(back_populates="slots")
    recipe: Mapped[Recipe | None] = relationship()
    votes: Mapped[list[Vote]] = relationship(
        back_populates="slot", cascade="all, delete-orphan", order_by="Vote.id"
    )


class Vote(TimestampMixin, Base):
    __tablename__ = "votes"
    __table_args__ = (UniqueConstraint("slot_id", "person", name="uq_vote_slot_person"),)
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.id", ondelete="CASCADE"))
    person: Mapped[str] = mapped_column(String(20))
    value: Mapped[str] = mapped_column(String(8))  # up, down

    slot: Mapped[Slot] = relationship(back_populates="votes")


class QueueEntry(TimestampMixin, Base):
    __tablename__ = "queue"
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), unique=True)
    by: Mapped[str] = mapped_column(String(20))

    recipe: Mapped[Recipe] = relationship()


class Request(TimestampMixin, Base):
    __tablename__ = "requests"
    who: Mapped[str] = mapped_column(String(20))
    type: Mapped[str] = mapped_column(String(8))  # meal, out
    text: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(12), default="new")  # new, planned, declined
    reply: Mapped[str | None] = mapped_column(Text, nullable=True)
    week_id: Mapped[int | None] = mapped_column(
        ForeignKey("weeks.id", ondelete="SET NULL"), nullable=True
    )


class PantryPhoto(TimestampMixin, Base):
    __tablename__ = "pantry_photos"
    path: Mapped[str] = mapped_column(String(500))  # relative to the media dir
    label: Mapped[str | None] = mapped_column(String(120), nullable=True)
    uploaded_by: Mapped[str] = mapped_column(String(20))
    read_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class PantryItem(TimestampMixin, Base):
    __tablename__ = "pantry_items"
    area: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    qty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    state: Mapped[str] = mapped_column(String(12), default="found")  # found, unsure, confirmed, removed
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("pantry_photos.id", ondelete="SET NULL"), nullable=True
    )
    added_by: Mapped[str | None] = mapped_column(String(20), nullable=True)


class Staple(TimestampMixin, Base):
    """Superseded by recipes tagged "Staples" (migration 0005 copied these over). Kept so old rows are not lost."""

    __tablename__ = "staples"
    name: Mapped[str] = mapped_column(String(200))
    section: Mapped[str] = mapped_column(String(20))
    from_: Mapped[str | None] = mapped_column("from", String(20), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Deal(TimestampMixin, Base):
    __tablename__ = "deals"
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id", ondelete="CASCADE"))
    valid_from: Mapped[date | None] = mapped_column(Date, nullable=True)
    valid_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    item: Mapped[str] = mapped_column(String(200))
    price: Mapped[str] = mapped_column(String(40))  # "$3.49", "2/$5"
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    section: Mapped[str] = mapped_column(String(20))
    source_image: Mapped[str | None] = mapped_column(String(500), nullable=True)

    store: Mapped[Store] = relationship()


class ListAdd(TimestampMixin, Base):
    __tablename__ = "list_adds"
    week_id: Mapped[int] = mapped_column(ForeignKey("weeks.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(200))
    qty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    section: Mapped[str] = mapped_column(String(20))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    from_: Mapped[str | None] = mapped_column("from", String(20), nullable=True)


class ListEdit(TimestampMixin, Base):
    __tablename__ = "list_edits"
    __table_args__ = (UniqueConstraint("week_id", "item_key", name="uq_list_edit_key"),)
    week_id: Mapped[int] = mapped_column(ForeignKey("weeks.id", ondelete="CASCADE"))
    item_key: Mapped[str] = mapped_column(String(200))
    qty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    section: Mapped[str | None] = mapped_column(String(20), nullable=True)
    removed: Mapped[bool] = mapped_column(Boolean, default=False)


class ListCheck(TimestampMixin, Base):
    __tablename__ = "list_checks"
    __table_args__ = (UniqueConstraint("week_id", "item_key", name="uq_list_check_key"),)
    week_id: Mapped[int] = mapped_column(ForeignKey("weeks.id", ondelete="CASCADE"))
    item_key: Mapped[str] = mapped_column(String(200))
    checked_by: Mapped[str] = mapped_column(String(20))


class Feedback(TimestampMixin, Base):
    __tablename__ = "feedback"
    kind: Mapped[str] = mapped_column(String(12))  # rejection, rating, preference
    recipe_id: Mapped[int | None] = mapped_column(
        ForeignKey("recipes.id", ondelete="SET NULL"), nullable=True
    )
    text: Mapped[str | None] = mapped_column(Text, nullable=True)
    reasons: Mapped[list[str]] = mapped_column(JSON, default=list)
    remember: Mapped[bool] = mapped_column(Boolean, default=False)
    who: Mapped[str] = mapped_column(String(20))


class CookLog(TimestampMixin, Base):
    __tablename__ = "cook_log"
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date)
    stars: Mapped[int | None] = mapped_column(Integer, nullable=True)
    who: Mapped[str] = mapped_column(String(20))


class ChatMessage(TimestampMixin, Base):
    __tablename__ = "chat_messages"
    who: Mapped[str] = mapped_column(String(20))  # the person whose conversation this is
    from_: Mapped[str] = mapped_column("from", String(8))  # me, cafe
    text: Mapped[str] = mapped_column(Text)
    proposal: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    list_changes: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    week_id: Mapped[int | None] = mapped_column(
        ForeignKey("weeks.id", ondelete="SET NULL"), nullable=True
    )


class Job(TimestampMixin, Base):
    __tablename__ = "jobs"
    type: Mapped[str] = mapped_column(String(40))
    status: Mapped[str] = mapped_column(String(12), default="queued")  # queued, running, done, failed, resting, cancelled
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    result: Mapped[Any | None] = mapped_column(JSON, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    requested_by: Mapped[str | None] = mapped_column(String(20), nullable=True)


class Setting(TimestampMixin, Base):
    __tablename__ = "settings"
    key: Mapped[str] = mapped_column(String(80), unique=True)
    value: Mapped[Any] = mapped_column(JSON, nullable=True)
