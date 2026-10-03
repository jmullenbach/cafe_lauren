"""Instacart Developer Platform client: "create shopping list page" (BUILD_PLAN section 7)."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any

import httpx
from sqlalchemy.orm import Session

from .. import models as m
from ..config import Settings
from . import grocery
from . import weeks as W

DEV_BASE = "https://connect.dev.instacart.tools"
PROD_BASE = "https://connect.instacart.com"
ENDPOINT = "/idp/v1/products/products_link"

# Set in tests to route requests through httpx.MockTransport.
TRANSPORT: httpx.BaseTransport | None = None

# Our unit words (singular, via grocery.singular_unit) -> units Instacart accepts.
UNIT_MAP = {
    "lb": "pound", "pound": "pound", "oz": "ounce", "ounce": "ounce", "g": "gram", "gram": "gram",
    "kg": "kilogram", "cup": "cup", "tbsp": "tablespoon", "tablespoon": "tablespoon",
    "tsp": "teaspoon", "teaspoon": "teaspoon", "gallon": "gallon", "gal": "gallon",
    "quart": "quart", "pint": "pint", "liter": "liter", "ml": "milliliter",
}


class InstacartNotConfigured(Exception):
    """No INSTACART_API_KEY is set."""


class InstacartError(Exception):
    """Instacart rejected or failed the request."""


@dataclass
class LineItem:
    name: str
    quantity: float
    unit: str
    display_text: str

    def as_dict(self) -> dict[str, Any]:
        return {"name": self.name, "quantity": self.quantity, "unit": self.unit,
                "display_text": self.display_text}


def map_item(name: str, qty: str | None) -> LineItem:
    """One list item to an Instacart line item; falls back to `each` with the amount in display_text."""
    original = " ".join(x for x in [(qty or "").strip(), name] if x)
    q = (qty or "").strip()
    if q and " + " not in q:
        parsed = grocery._parse_part(q)
        if parsed:
            n, unit_word = parsed
            if n > 0:
                if not unit_word:
                    return LineItem(name, n, "each", original)
                unit = UNIT_MAP.get(grocery.singular_unit(unit_word))
                if unit:
                    return LineItem(name, n, unit, original)
    return LineItem(name, 1, "each", original)


def unchecked_line_items(db: Session, week: m.Week) -> list[LineItem]:
    return [map_item(i.name, i.qty) for i in grocery.derive_items(db, week) if not i.checked]


def items_hash(items: list[LineItem], retailer_key: str | None) -> str:
    blob = json.dumps([sorted(i.as_dict().items()) for i in items] + [retailer_key], sort_keys=True)
    return hashlib.sha256(blob.encode()).hexdigest()


def base_url(cfg: Settings) -> str:
    return (cfg.instacart_base or DEV_BASE).rstrip("/")


def _cache_key(week: m.Week) -> str:
    return f"instacart_link:{week.monday.isoformat()}"


def status(cfg: Settings) -> str:
    return "configured" if cfg.instacart_api_key else "not set up yet"


def with_retailer(url: str, retailer_key: str | None) -> str:
    if not retailer_key:
        return url
    return f"{url}{'&' if '?' in url else '?'}retailer_key={retailer_key}"


def create_link(cfg: Settings, title: str, items: list[LineItem], retailer_key: str | None) -> str:
    if not cfg.instacart_api_key:
        raise InstacartNotConfigured()
    body = {"title": title, "link_type": "shopping_list", "expires_in": 7,
            "line_items": [i.as_dict() for i in items]}
    try:
        with httpx.Client(transport=TRANSPORT, timeout=30) as c:
            r = c.post(base_url(cfg) + ENDPOINT, json=body, headers={
                "Authorization": f"Bearer {cfg.instacart_api_key}",
                "Content-Type": "application/json", "Accept": "application/json"})
    except httpx.HTTPError as e:
        raise InstacartError(f"Could not reach Instacart: {e}") from e
    if r.status_code >= 400:
        raise InstacartError(f"Instacart returned {r.status_code}: {r.text[:200]}")
    url = (r.json() or {}).get("products_link_url")
    if not url:
        raise InstacartError("Instacart response had no products_link_url")
    return with_retailer(url, retailer_key)


def link_for_week(db: Session, cfg: Settings, week: m.Week) -> tuple[str, bool, int]:
    """Returns (url, cached, item_count). Reuses the stored URL while the unchecked items are unchanged."""
    if not cfg.instacart_api_key:
        raise InstacartNotConfigured()
    items = unchecked_line_items(db, week)
    if not items:
        raise InstacartError("Nothing left to order: every item is checked off")
    retailer = week.store.instacart_retailer_key if week.store else None
    digest = items_hash(items, retailer)
    cached = W.get_setting(db, _cache_key(week))
    if isinstance(cached, dict) and cached.get("hash") == digest and cached.get("url"):
        return cached["url"], True, len(items)
    url = create_link(cfg, f"Café Lauren · {W.week_label(week.monday)}", items, retailer)
    W.set_setting(db, _cache_key(week), {"hash": digest, "url": url})
    db.flush()
    return url, False, len(items)
