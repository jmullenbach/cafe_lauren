#!/usr/bin/env python3
"""One-time import of the Notion Menu database, Staples entry and old menu.md files.

Run from the repo root:

    cd backend && uv run python ../scripts/import_notion.py [--dry-run] [--db PATH]
                                                            [--fixtures DIR] [--menus DIR]

* Menu database entries -> `recipes` (source=imported, status=saved).
* The "Staples" entry -> the ingredients of a recipe titled and tagged "Staples".
* data/archive/*/menu.md and data/current_week/menu.md -> past `weeks` + `slots`.

Idempotent: recipes are matched by Notion page id, staples by name, weeks by Monday.
The recipes table has no Notion id column, so the id is stored as a `notion:<page id>`
entry in `recipes.tags` (JSON). Day tags ("1. Monday" ...) are dropped.

Notion is read with thin httpx readers that call the same endpoints as
scripts/notion_helpers.py (database query, block children). notion_helpers itself is not
imported because it needs `requests` and `python-dotenv`, which the backend env lacks.
"""

from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import sys
import tempfile
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import select  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from cafe import models as m  # noqa: E402
from cafe.config import Settings  # noqa: E402
from cafe.db import Database, run_migrations  # noqa: E402
from cafe.services import weeks as W  # noqa: E402
from cafe.services.grocery import parse_free_text, section_of  # noqa: E402

NOTION_VERSION = "2022-06-28"
DAY_TAG_RE = re.compile(r"^\s*\d+\.\s")
DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
DAY_NAMES = {n: i for i, n in enumerate(
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])}
MONTHS = {n: i + 1 for i, n in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"])}
IMPORT_BY = "import"


# ---------------------------------------------------------------- report


@dataclass
class Report:
    recipes_created: int = 0
    recipes_updated: int = 0
    staples_created: int = 0
    staples_existing: int = 0
    weeks_created: int = 0
    weeks_existing: int = 0
    slots_matched: int = 0
    slots_text: int = 0
    last_made_set: int = 0
    unparsed: list[tuple[str, str]] = field(default_factory=list)

    def bad(self, where: str, reason: str) -> None:
        self.unparsed.append((where, reason))

    def render(self, dry_run: bool) -> str:
        out = ["Notion import summary" + (" (DRY RUN, nothing saved)" if dry_run else "")]
        out.append(f"  Recipes:  {self.recipes_created} created, {self.recipes_updated} updated")
        out.append(f"  Staples:  {self.staples_created} created, {self.staples_existing} already present")
        out.append(f"  Weeks:    {self.weeks_created} created, {self.weeks_existing} already present")
        out.append(f"  Slots:    {self.slots_matched} matched to a recipe, {self.slots_text} text-only")
        out.append(f"  Recipes with last_made set/updated: {self.last_made_set}")
        out.append(f"  Could not parse: {len(self.unparsed)}")
        for where, reason in self.unparsed:
            out.append(f"    - {where}: {reason}")
        return "\n".join(out)


# ---------------------------------------------------------------- sources


def _load_env_file(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


class FixtureSource:
    """Reads saved Notion responses: database_query.json and children_<page id>.json."""

    def __init__(self, directory: Path):
        self.dir = Path(directory)

    def pages(self) -> list[dict[str, Any]]:
        return json.loads((self.dir / "database_query.json").read_text())["results"]

    def children(self, block_id: str) -> list[dict[str, Any]]:
        f = self.dir / f"children_{block_id}.json"
        if not f.exists():
            return []
        return json.loads(f.read_text())["results"]

    @property
    def staples_page_id(self) -> str | None:
        return None


class NotionSource:
    """Live Notion reads with httpx (same endpoints as notion_helpers.py)."""

    def __init__(self) -> None:
        env = {**_load_env_file(REPO_ROOT / ".env"), **os.environ}
        self.token = env.get("NOTION_API_TOKEN", "")
        self.db_id = env.get("NOTION_MENU_DB_ID", "")
        self._staples = env.get("NOTION_STAPLES_PAGE_ID") or None
        if not self.token or not self.db_id:
            raise SystemExit("NOTION_API_TOKEN and NOTION_MENU_DB_ID must be set in .env")
        import httpx

        self.client = httpx.Client(
            headers={"Authorization": f"Bearer {self.token}", "Notion-Version": NOTION_VERSION},
            timeout=30,
        )

    @property
    def staples_page_id(self) -> str | None:
        return self._staples

    def pages(self) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        body: dict[str, Any] = {"page_size": 100}
        while True:
            r = self.client.post(f"https://api.notion.com/v1/databases/{self.db_id}/query", json=body)
            r.raise_for_status()
            data = r.json()
            out.extend(data.get("results", []))
            if not data.get("has_more"):
                return out
            body = {"page_size": 100, "start_cursor": data["next_cursor"]}

    def children(self, block_id: str) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        cursor = None
        while True:
            params: dict[str, Any] = {"page_size": 100}
            if cursor:
                params["start_cursor"] = cursor
            r = self.client.get(f"https://api.notion.com/v1/blocks/{block_id}/children", params=params)
            r.raise_for_status()
            data = r.json()
            out.extend(data.get("results", []))
            if not data.get("has_more"):
                return out
            cursor = data["next_cursor"]


def load_blocks(source, block_id: str, depth: int = 0) -> list[dict[str, Any]]:
    """Children of a block, with nested children flattened in after their parent."""
    flat: list[dict[str, Any]] = []
    for b in source.children(block_id):
        flat.append(b)
        if b.get("has_children") and depth < 3 and b.get("type") != "child_page":
            flat.extend(load_blocks(source, b["id"], depth + 1))
    return flat


# ---------------------------------------------------------------- rich text


def _plain(p: dict[str, Any]) -> str:
    return p.get("plain_text") or (p.get("text") or {}).get("content", "")


def rich_md(parts: list[dict[str, Any]]) -> str:
    """Rich text to markdown: bold runs become **...**, everything else is plain."""
    segs: list[list[Any]] = []
    for p in parts or []:
        bold = bool((p.get("annotations") or {}).get("bold"))
        t = _plain(p)
        if segs and segs[-1][0] == bold:
            segs[-1][1] += t
        else:
            segs.append([bold, t])
    out = []
    for bold, t in segs:
        if bold and t.strip():
            lead = t[: len(t) - len(t.lstrip())]
            trail = t[len(t.rstrip()):]
            out.append(f"{lead}**{t.strip()}**{trail}")
        else:
            out.append(t)
    return "".join(out)


def rich_plain(parts: list[dict[str, Any]]) -> str:
    return "".join(_plain(p) for p in parts or [])


def all_italic(parts: list[dict[str, Any]]) -> bool:
    texts = [p for p in parts or [] if _plain(p).strip()]
    return bool(texts) and all((p.get("annotations") or {}).get("italic") for p in texts)


def block_parts(b: dict[str, Any]) -> list[dict[str, Any]]:
    return (b.get(b.get("type", ""), {}) or {}).get("rich_text", []) or []


# ---------------------------------------------------------------- recipe body parsing


def _num(s: str) -> float:
    return float(s)


def _minutes(text: str, label: str) -> int | None:
    mt = re.search(rf"{label}\s*:?\**\s*(?:~\s*)?(?:(\d+(?:\.\d+)?)\s*(?:hrs?|hours?|h)\b)?\s*(?:(\d+)\s*(?:min\w*|m)\b)?",
                   text, re.I)
    if not mt or not (mt.group(1) or mt.group(2)):
        return None
    return int(round(_num(mt.group(1) or "0") * 60 + int(mt.group(2) or 0)))


def parse_stats(text: str) -> dict[str, Any]:
    stats: dict[str, Any] = {}
    for key, label in (("prep_min", "prep time"), ("cook_min", "cook time"), ("total_min", "total")):
        v = _minutes(text, label)
        if v is not None:
            stats[key] = v
    for key, label in (("healthy", "healthiness"), ("delicious", "deliciousness")):
        mt = re.search(rf"{label}\s*:?\**\s*(\d+)\s*/\s*10", text, re.I)
        if mt:
            stats[key] = int(mt.group(1))
    mt = re.search(r"cost\s*:?\**\s*~?\s*\$\s*(\d+(?:\.\d+)?)", text, re.I)
    if mt:
        stats["cost_usd"] = float(mt.group(1))
    mt = re.search(r"method\s*:?\**\s*([A-Za-z][A-Za-z +/-]{1,38}?)\s*(?:\||$)", text, re.I)
    if mt:
        stats["method"] = mt.group(1).strip()
    return stats


def _clean_line(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^(?:[•\-\*]\s*)?(?:\[[ xX]?\]\s*)?", "", s)
    return s.strip()


def _is_group(line: str) -> str | None:
    plain = line.replace("**", "").strip()
    if plain.endswith(":") and len(plain) < 80:
        return plain[:-1].strip()
    return None


def split_ingredient(qty_text: str | None) -> tuple[str, str]:
    if not qty_text:
        return "", ""
    mt = re.match(r"^(.*\S)\s+([A-Za-z][A-Za-z ]*)$", qty_text)
    if mt and re.search(r"[\d½¼¾⅓⅔]|^an?$|half", mt.group(1), re.I):
        return mt.group(1), mt.group(2)
    return qty_text, ""


def parse_ingredient(line: str, group: str | None, report: Report, where: str) -> dict[str, Any] | None:
    raw = _clean_line(line).replace("**", "").strip()
    if not raw:
        return None
    try:
        p = parse_free_text(raw)
        if not p.name:
            raise ValueError("empty name")
        qty, unit = split_ingredient(p.qty)
        if p.qty is None and re.match(r"^\d", raw):
            report.bad(where, f"ingredient quantity not recognised, kept raw: {raw!r}")
            return {"qty": "", "unit": "", "name": raw, "group": group}
        return {"qty": qty, "unit": unit, "name": p.name, "group": group}
    except Exception as e:  # noqa: BLE001 - best effort by design
        report.bad(where, f"ingredient line failed to parse ({e}), kept raw: {raw!r}")
        return {"qty": "", "unit": "", "name": raw, "group": group}


def parse_ingredient_text(text: str, report: Report, where: str) -> list[dict[str, Any]]:
    """Ingredients property (rich text with bullets and **section:** headers)."""
    out: list[dict[str, Any]] = []
    group: str | None = None
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        g = _is_group(_clean_line(line))
        if g is not None:
            group = None if g.lower() == "ingredients" else g
            continue
        ing = parse_ingredient(line, group, report, where)
        if ing:
            out.append(ing)
    return out


SECTION_WORDS = {
    "ingredients": "ingredients",
    "instructions": "steps", "directions": "steps", "steps": "steps", "method": "steps",
    "leftover": "leftovers",
}


def _section_for(heading: str) -> str | None:
    h = heading.lower()
    for word, sec in SECTION_WORDS.items():
        if word in h:
            return sec
    return None


def parse_body(blocks: list[dict[str, Any]], title: str, report: Report, where: str) -> dict[str, Any]:
    res: dict[str, Any] = {"description": "", "stats": {}, "ingredients": [], "steps": [], "leftovers": None}
    section: str | None = None
    ing_group: str | None = None
    groups: list[dict[str, Any]] = []
    cur: dict[str, Any] | None = None
    left: list[str] = []
    stat_text: list[str] = []
    fallback_desc = ""

    def add_step(text: str) -> None:
        nonlocal cur
        if cur is None:
            cur = {"group": "Steps", "steps": []}
            groups.append(cur)
        cur["steps"].append(text)

    for b in blocks:
        t = b.get("type", "")
        parts = block_parts(b)
        md = rich_md(parts).strip()
        plain = rich_plain(parts).strip()
        if t in ("heading_1", "heading_2", "heading_3"):
            sec = _section_for(plain)
            if sec:
                section = sec
                ing_group = None
                continue
            if section is None and plain.lower() == title.lower():
                continue
            if section == "steps":
                cur = {"group": plain.rstrip(":"), "steps": []}
                groups.append(cur)
            elif section == "ingredients":
                ing_group = plain.rstrip(":")
            else:
                section = "other"
            continue
        if not plain:
            continue
        is_item = t in ("to_do", "bulleted_list_item", "numbered_list_item")
        if section is None:
            if re.search(r"prep time|cook time|healthiness|deliciousness|serves\s*:|cost\s*:|total\s*:", plain, re.I):
                stat_text.append(md)
            elif t == "paragraph" and not res["description"] and all_italic(parts):
                res["description"] = plain
            elif t == "paragraph" and not fallback_desc:
                fallback_desc = plain
            continue
        if section == "ingredients":
            g = _is_group(md) if t == "paragraph" else None
            if g is not None:
                ing_group = g
                continue
            ing = parse_ingredient(md, ing_group, report, where)
            if ing:
                res["ingredients"].append(ing)
        elif section == "steps":
            g = _is_group(md) if t == "paragraph" else None
            if g is not None:
                cur = {"group": g, "steps": []}
                groups.append(cur)
            elif is_item or t == "paragraph":
                add_step(_clean_line(md) if is_item else md)
        elif section == "leftovers":
            left.append(_clean_line(md))
    res["stats"] = parse_stats(" | ".join(stat_text))
    if not res["description"]:
        res["description"] = fallback_desc
    res["steps"] = [g for g in groups if g["steps"]]
    res["leftovers"] = "\n".join(left) if left else None
    return res


# ---------------------------------------------------------------- Notion pages -> DB


def page_title(page: dict[str, Any]) -> str:
    return rich_plain(((page.get("properties") or {}).get("Title") or {}).get("title", [])).strip()


def page_stars(prop: dict[str, Any] | None, report: Report, where: str) -> int | None:
    if not prop:
        return None
    if prop.get("type") == "number" or "number" in prop and prop.get("number") is not None:
        v = prop.get("number")
        return int(round(v)) if v is not None else None
    sel = prop.get("select")
    if sel:
        name = sel.get("name", "")
        if "★" in name or "⭐" in name:
            return name.count("★") + name.count("⭐")
        mt = re.search(r"\d", name)
        if mt:
            return int(mt.group(0))
        report.bad(where, f"stars value not recognised: {name!r}")
    return None


def page_tags(prop: dict[str, Any] | None) -> list[str]:
    if not prop:
        return []
    names: list[str] = []
    if prop.get("select"):
        names.append(prop["select"]["name"])
    for o in prop.get("multi_select") or []:
        names.append(o["name"])
    return [n for n in names if not DAY_TAG_RE.match(n)]


def notion_tag(page_id: str) -> str:
    return f"notion:{page_id}"


def find_recipe_by_notion_id(db: Session, page_id: str) -> m.Recipe | None:
    tag = notion_tag(page_id)
    for r in db.scalars(select(m.Recipe)):
        if tag in (r.tags or []):
            return r
    return None


def import_recipe(db: Session, source, page: dict[str, Any], report: Report) -> None:
    pid = page.get("id", "?")
    title = page_title(page)
    if not title:
        report.bad(f"page {pid}", "no title, skipped")
        return
    where = f"recipe {title!r}"
    props = page.get("properties") or {}
    stars = page_stars(props.get("Stars"), report, where)
    tags = page_tags(props.get("Tags"))

    try:
        blocks = load_blocks(source, pid)
    except Exception as e:  # noqa: BLE001
        report.bad(where, f"could not read page body: {e}")
        blocks = []
    body = parse_body(blocks, title, report, where)

    ing_prop = (props.get("Ingredients") or {}).get("rich_text", [])
    ingredients = body["ingredients"]
    if not ingredients and ing_prop:
        ingredients = parse_ingredient_text(rich_md(ing_prop), report, where)
    if not ingredients:
        report.bad(where, "no ingredients found in the page body or the Ingredients property")
    if not body["steps"]:
        report.bad(where, "no steps found in the page body")

    stats = body["stats"]
    fields: dict[str, Any] = {
        "title": title[:200],
        "stars": stars,
        "description": body["description"],
        "ingredients": ingredients,
        "steps": body["steps"],
        "leftovers": body["leftovers"],
    }
    for k in ("prep_min", "cook_min", "total_min", "healthy", "delicious", "cost_usd", "method"):
        if k in stats:
            fields[k] = stats[k]

    existing = find_recipe_by_notion_id(db, pid)
    if existing is None:
        db.add(m.Recipe(tags=tags + [notion_tag(pid)], source="imported", status="saved", **fields))
        report.recipes_created += 1
    else:
        for k, v in fields.items():
            setattr(existing, k, v)
        old_other = [t for t in (existing.tags or []) if not t.startswith("notion:")]
        merged = old_other + [t for t in tags if t not in old_other]
        existing.tags = merged + [notion_tag(pid)]
        report.recipes_updated += 1
    db.flush()


def parse_staple_lines(page: dict[str, Any], blocks: list[dict[str, Any]]) -> list[str]:
    lines = rich_plain(((page.get("properties") or {}).get("Ingredients") or {}).get("rich_text", [])).split("\n")
    for b in blocks:
        if b.get("type") in ("to_do", "bulleted_list_item", "numbered_list_item", "paragraph"):
            lines.append(rich_plain(block_parts(b)))
    items: list[str] = []
    for line in lines:
        line = _clean_line(line)
        line = re.split(r"\s+[—–]\s+|\s+-\s+", line)[0].strip()
        if line and not line.endswith(":") and line.lower() not in {x.lower() for x in items}:
            items.append(line)
    return items


def import_staples(db: Session, source, page: dict[str, Any], report: Report) -> None:
    try:
        blocks = load_blocks(source, page["id"])
    except Exception as e:  # noqa: BLE001
        report.bad("staples", f"could not read page body: {e}")
        blocks = []
    items = parse_staple_lines(page, blocks)
    if not items:
        report.bad("staples", "Staples entry has no items")
    _recipe, new = W.ensure_staples_recipe(db, [n[:200] for n in items])
    report.staples_created += new
    report.staples_existing += len(items) - new


def import_notion(db: Session, source, report: Report) -> None:
    pages = source.pages()
    staples_id = (source.staples_page_id or "").replace("-", "")
    for page in pages:
        pid = (page.get("id") or "").replace("-", "")
        is_staples = page_title(page).lower() == "staples" or (staples_id and pid == staples_id)
        try:
            if is_staples:
                import_staples(db, source, page, report)
            else:
                import_recipe(db, source, page, report)
        except Exception as e:  # noqa: BLE001
            report.bad(f"page {page.get('id', '?')} ({page_title(page) or 'untitled'})", f"unexpected error: {e}")


# ---------------------------------------------------------------- menu.md -> weeks and slots


def norm_title(s: str) -> str:
    s = s.lower().replace("&", " and ")
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[^a-z0-9 ]+", " ", s.replace("'", ""))
    return re.sub(r"\s+", " ", s).strip()


def match_recipe(title: str, recipes: dict[str, m.Recipe], cutoff: float = 0.8) -> m.Recipe | None:
    cleaned = re.sub(r"\([^)]*\)", " ", title)
    candidates = {norm_title(title), norm_title(cleaned)}
    stripped = re.split(r"\s+with\s+", cleaned, maxsplit=1)[0]
    candidates.add(norm_title(stripped))
    best: tuple[float, str] | None = None
    for c in candidates:
        if not c:
            continue
        for key in recipes:
            score = 1.0 if c == key else difflib.SequenceMatcher(None, c, key).ratio()
            if score >= cutoff and (best is None or score > best[0]):
                best = (score, key)
    return recipes[best[1]] if best else None


@dataclass
class MenuRow:
    day_date: date
    title: str
    kind: str
    notes: str


def _strip_md(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("**", "").strip().strip("*").strip())


def heading_year(text: str, folder: str | None) -> int | None:
    mt = re.search(r"^#\s.*?(\d{4})", text, re.M)
    if mt:
        return int(mt.group(1))
    mt = re.match(r"(\d{4})-", folder or "")
    return int(mt.group(1)) if mt else None


def parse_menu_md(text: str, folder: str | None, report: Report, where: str) -> list[MenuRow]:
    year = heading_year(text, folder)
    if year is None:
        report.bad(where, "no year found in heading or folder name, file skipped")
        return []
    rows: list[MenuRow] = []
    for line in text.splitlines():
        if not line.lstrip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2:
            continue
        mt = re.match(r"^\**\s*([A-Za-z]+day)\s*\(\s*([A-Za-z]+)\.?\s+(\d{1,2})\s*\)\s*\**$", cells[0])
        if not mt:
            continue
        dayname, mon, dom = mt.group(1).lower(), mt.group(2)[:3].lower(), int(mt.group(3))
        if dayname not in DAY_NAMES or mon not in MONTHS:
            report.bad(where, f"unrecognised day cell {cells[0]!r}")
            continue
        try:
            d = date(year, MONTHS[mon], dom)
        except ValueError:
            report.bad(where, f"invalid date in {cells[0]!r}")
            continue
        if d.weekday() != DAY_NAMES[dayname]:
            report.bad(where, f"{cells[0]!r} is not a {dayname} in {year}; kept the date, ignored the day name")
        meal_cell = cells[1]
        method = cells[2] if len(cells) > 2 else ""
        notes = cells[3] if len(cells) > 3 else ""
        title = _strip_md(meal_cell)
        if not title:
            report.bad(where, f"empty meal cell for {cells[0]!r}")
            continue
        italic = meal_cell.strip().startswith("*") and not meal_cell.strip().startswith("**")
        if re.search(r"leidy", title, re.I):
            kind = "leidy"
        elif re.search(r"leftover", title, re.I) and (italic or method in ("", "—", "-", "Reheat")):
            kind = "leftover"
        elif italic:
            kind = "custom"
        else:
            kind = "cook"
        rows.append(MenuRow(d, title, kind, _strip_md(notes)))
    if not rows:
        report.bad(where, "no schedule table rows found")
    return rows


def monday_of(d: date) -> date:
    return d - timedelta(days=d.weekday())


def menu_files(root: Path) -> list[tuple[Path, str | None]]:
    files: list[tuple[Path, str | None]] = []
    arch = root / "archive"
    if arch.is_dir():
        for d in sorted(p for p in arch.iterdir() if p.is_dir()):
            if (d / "menu.md").exists():
                files.append((d / "menu.md", d.name))
    if (root / "current_week" / "menu.md").exists():
        files.append((root / "current_week" / "menu.md", None))
    return files


def import_menus(db: Session, root: Path, report: Report) -> None:
    recipes = {
        norm_title(r.title): r
        for r in db.scalars(select(m.Recipe).where(m.Recipe.source == "imported"))
    }
    claimed: set[tuple[date, str]] = set()
    last_made: dict[int, date] = {}
    weeks: dict[date, m.Week] = {}

    for path, folder in menu_files(root):
        where = f"menu {path.parent.name}/{path.name}"
        try:
            rows = parse_menu_md(path.read_text(), folder, report, where)
        except Exception as e:  # noqa: BLE001
            report.bad(where, f"unexpected error: {e}")
            continue
        for row in rows:
            monday = monday_of(row.day_date)
            day = DAYS[row.day_date.weekday()]
            if (monday, day) in claimed:
                report.bad(where, f"{row.day_date} {row.title!r}: another menu file already filled that day, skipped")
                continue
            claimed.add((monday, day))
            week = weeks.get(monday)
            if week is None:
                week = db.scalar(select(m.Week).where(m.Week.monday == monday))
                if week is None:
                    week = m.Week(monday=monday)
                    db.add(week)
                    db.flush()
                    report.weeks_created += 1
                else:
                    report.weeks_existing += 1
                weeks[monday] = week
            slot = db.scalar(select(m.Slot).where(m.Slot.week_id == week.id, m.Slot.day == day))
            if slot is not None and slot.by != IMPORT_BY:
                report.bad(where, f"{row.day_date} {row.title!r}: slot already exists in the app, left alone")
                continue
            recipe = None if row.kind in ("leftover", "custom") else match_recipe(row.title, recipes)
            if slot is None:
                slot = m.Slot(week_id=week.id, day=day)
                db.add(slot)
            slot.kind = row.kind
            slot.recipe_id = recipe.id if recipe else None
            slot.text = None if recipe else row.title
            slot.status = "approved"
            slot.by = IMPORT_BY
            slot.basis = row.notes or None
            slot.cook = "leidy" if row.kind == "leidy" else None
            if recipe:
                report.slots_matched += 1
                if row.kind in ("cook", "leidy"):
                    last_made[recipe.id] = max(last_made.get(recipe.id, row.day_date), row.day_date)
            else:
                report.slots_text += 1
    db.flush()
    by_id = {r.id: r for r in recipes.values()}
    for rid, d in last_made.items():
        r = by_id[rid]
        if r.last_made is None or r.last_made < d:
            r.last_made = d
            report.last_made_set += 1
    db.flush()


# ---------------------------------------------------------------- driver


def run_import(db: Session, source, menus_root: Path | None, report: Report | None = None) -> Report:
    report = report or Report()
    if source is not None:
        import_notion(db, source, report)
    if menus_root is not None:
        import_menus(db, Path(menus_root), report)
    return report


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="do everything, then roll back")
    ap.add_argument("--db", type=Path, help="SQLite path (default: CAFE_DB_PATH / data/cafe.db)")
    ap.add_argument("--fixtures", type=Path, help="read saved Notion responses from DIR instead of the network")
    ap.add_argument("--menus", type=Path, default=REPO_ROOT / "data",
                    help="folder holding archive/*/menu.md and current_week/menu.md (default: repo data/)")
    ap.add_argument("--skip-notion", action="store_true", help="only import the menu.md files")
    args = ap.parse_args(argv)

    settings = Settings(cafe_db_path=args.db) if args.db else Settings()
    db_path = settings.cafe_db_path
    tmpdir = None
    if args.dry_run and not db_path.exists():
        tmpdir = tempfile.TemporaryDirectory()
        db_path = Path(tmpdir.name) / "dry.db"
        settings = Settings(cafe_db_path=db_path)
    run_migrations(db_path)

    source = None
    if not args.skip_notion:
        source = FixtureSource(args.fixtures) if args.fixtures else NotionSource()

    database = Database(settings)
    session = database.SessionLocal()
    try:
        report = run_import(session, source, args.menus)
        if args.dry_run:
            session.rollback()
        else:
            session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
        database.dispose()
        if tmpdir:
            tmpdir.cleanup()
    print(report.render(args.dry_run))
    return 0


if __name__ == "__main__":
    sys.exit(main())
