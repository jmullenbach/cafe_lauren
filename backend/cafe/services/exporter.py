"""Exports: all data as JSON, recipes as markdown (CLAUDE.md format), a SQLite copy, a week as markdown."""

from __future__ import annotations

import io
import re
import sqlite3
import tempfile
import zipfile
from datetime import date, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import inspect, select
from sqlalchemy.orm import Session

from .. import models as m
from . import grocery
from . import weeks as W

SCHEMA_VERSION = 1
DAY_NAMES = {"mon": "Monday", "tue": "Tuesday", "wed": "Wednesday", "thu": "Thursday",
             "fri": "Friday", "sat": "Saturday", "sun": "Sunday"}


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "recipe"


def _plain(v: Any) -> Any:
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    return v


def dump_all(db: Session) -> dict[str, Any]:
    """Every table as a list of column->value dicts (JSON-serialisable)."""
    tables: dict[str, list[dict[str, Any]]] = {}
    for table in m.Base.metadata.sorted_tables:
        cols = [c.name for c in table.columns]
        tables[table.name] = [{c: _plain(v) for c, v in zip(cols, row)}
                              for row in db.execute(select(table).order_by(table.c.id)).all()]
    return {"schema_version": SCHEMA_VERSION, "exported_at": datetime.now().isoformat(timespec="seconds"),
            "tables": tables}


# ---------------------------------------------------------------- recipes


def _qty_line(ing: dict[str, Any]) -> str:
    return " ".join(str(x).strip() for x in [ing.get("qty"), ing.get("unit"), ing.get("name")] if x and str(x).strip())


def recipe_markdown(r: m.Recipe) -> str:
    def mins(v):
        return f"{v} min" if v is not None else "- min"
    cost = f"~${r.cost_usd:g}" if r.cost_usd is not None else "~$-"
    L = [f"## {r.title}", f"*{(r.description or '').strip() or r.title}*",
         f"**Prep time:** {mins(r.prep_min)} | **Cook time:** {mins(r.cook_min)} | **Total:** {mins(r.total_min)}",
         f"**Serves:** 5 (+ leftovers) | **Healthiness:** {'-' if r.healthy is None else r.healthy}/10 | "
         f"**Deliciousness:** {'-' if r.delicious is None else r.delicious}/10 | **Cost:** {cost}",
         "", "### Ingredients"]
    L += [f"- [ ] {_qty_line(i)}" for i in (r.ingredients or [])] or ["- [ ] (none listed)"]
    L += ["", "### Instructions"]
    groups = r.steps or []
    if not groups:
        L += ["", "Method:", "- [ ] (no steps recorded)"]
    for g in groups:
        L += ["", f"{g.get('group') or 'Steps'}:"]
        L += [f"- [ ] {s}" for s in g.get("steps", [])]
    L += ["", "### Leftover Ideas"]
    left = (r.leftovers or "").strip()
    L += [left if left.startswith("-") else f"- {left}" if left else "- (none)"]
    return "\n".join(L) + "\n"


def recipes_zip(db: Session) -> bytes:
    buf = io.BytesIO()
    used: set[str] = set()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for r in db.scalars(select(m.Recipe).order_by(m.Recipe.id)):
            slug = base = slugify(r.title)
            n = 2
            while slug in used:
                slug, n = f"{base}-{n}", n + 1
            used.add(slug)
            z.writestr(f"{slug}.md", recipe_markdown(r))
    return buf.getvalue()


# ---------------------------------------------------------------- database copy


def database_copy(db_path: Path) -> Path:
    """A consistent copy via the SQLite online backup API. Caller deletes the file."""
    fd, name = tempfile.mkstemp(suffix=".db", prefix="cafe-export-")
    Path(name).unlink()
    src = sqlite3.connect(str(db_path))
    dst = sqlite3.connect(name)
    try:
        src.backup(dst)
    finally:
        dst.close()
        src.close()
    return Path(name)


# ---------------------------------------------------------------- week


def week_markdown(db: Session, week: m.Week) -> str:
    L = [f"# {W.week_label(week.monday)}", ""]
    if week.store:
        L += [f"Store: {week.store.name}", ""]
    L += ["## Menu", ""]
    slots = {s.day: s for s in week.slots}
    for d in grocery.DAY_ORDER:
        s = slots.get(d)
        if s is None or s.kind == "open":
            what = "Open"
        elif s.recipe is not None:
            what = s.recipe.title + (" (Leidy)" if s.kind == "leidy" else "")
        elif s.kind == "leftover":
            what = "Leftovers" + (f": {s.text}" if s.text else "")
        else:
            what = s.text or s.kind.title()
        L.append(f"- **{DAY_NAMES[d]}:** {what}")
    extra = slots.get(W.EXTRA)
    if extra is not None and extra.recipe is not None:
        L.append(f"- **Lunches & breakfast:** {extra.recipe.title}")
    L += ["", "## Grocery List", ""]
    items = grocery.derive_items(db, week)
    for sec in grocery.SECTIONS:
        rows = [i for i in items if i.section == sec["key"]]
        if not rows:
            continue
        L += [f"### {sec['name']}", ""]
        L += [f"☐ {' '.join(x for x in [i.qty, i.name] if x)}" + (f" ({i.note})" if i.note else "") + "  "
              if not i.checked else f"☑ {' '.join(x for x in [i.qty, i.name] if x)}  " for i in rows]
        L.append("")
    return "\n".join(L).rstrip() + "\n"
