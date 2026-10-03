"""Grocery list: derived (never stored), quantities, sections, parsing, diff.

The list for a week is built every time from:
  1. cook (and Leidy) slots with a recipe, their ingredients minus the ones
     flagged `have` for this week,
  2. active staples not confirmed in the pantry,
  3. `list_adds` (quick adds),
  4. `list_edits` (renames, amounts, notes, aisle moves, removals).
Checks are layered on top. Sections are the six from CLAUDE.md, in store order.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models as m

# ---------------------------------------------------------------- sections

SECTIONS: list[dict[str, str]] = [
    {"key": "produce", "name": "Produce", "label": "Produce", "icon": "carrot"},
    {"key": "frozen", "name": "Frozen", "label": "Frozen", "icon": "snowflake"},
    {"key": "meat", "name": "Meat / Deli / Bakery", "label": "Meat / Deli / Bakery", "icon": "beef"},
    {
        "key": "dry",
        "name": "Dry Goods / Canned / Condiments / Pasta / Rice / Spices",
        "label": "Dry Goods / Canned",
        "icon": "wheat",
    },
    {"key": "dairy", "name": "Dairy / Eggs", "label": "Dairy / Eggs", "icon": "milk"},
    {"key": "beverages", "name": "Beverages", "label": "Beverages", "icon": "cup-soda"},
]
SECTION_KEYS = [s["key"] for s in SECTIONS]
DEFAULT_SECTION = "dry"

_KEYWORDS: dict[str, list[str]] = {
    "produce": [
        "apple", "banana", "lemon", "lime", "orange", "navel orange", "grape", "berry", "berries",
        "strawberry", "strawberries", "blueberry", "blueberries", "raspberry", "raspberries",
        "avocado", "tomato", "roma tomato", "cherry tomato", "ripe tomato", "potato", "sweet potato",
        "yukon gold", "onion", "red onion", "white onion", "green onion", "scallion", "shallot",
        "garlic", "ginger", "lettuce", "romaine", "spinach", "kale", "arugula", "salad",
        "salad greens", "greens", "cabbage", "carrot", "celery", "cucumber", "zucchini", "squash",
        "yellow squash", "bell pepper", "jalapeno", "jalapeño", "poblano", "serrano", "broccoli",
        "cauliflower", "green bean", "corn", "sweet corn", "mushroom", "asparagus", "bok choy",
        "baby bok choy", "basil", "fresh basil", "cilantro", "parsley", "mint", "dill",
        "fresh thyme", "rosemary", "herb", "fruit", "peach", "peaches", "nectarine", "pear",
        "plum", "mango", "pineapple", "melon", "watermelon", "cantaloupe", "kiwi", "eggplant",
        "radish", "beet", "tofu", "produce", "brussels sprout", "snap pea", "leek", "fennel",
    ],
    "frozen": [
        "frozen", "ice cream", "frozen fruit", "frozen vegetable", "peas & carrots",
        "peas and carrots", "tater tot", "frozen pizza", "popsicle", "waffle", "fish stick",
        "ice pop", "edamame",
    ],
    "meat": [
        "chicken", "chicken thigh", "chicken breast", "thigh", "drumstick", "wing", "pork",
        "pork chop", "pork loin", "tenderloin", "ground pork", "bacon", "ham", "sausage",
        "chorizo", "kielbasa", "bratwurst", "beef", "ground beef", "sirloin", "steak", "brisket",
        "roast", "turkey", "ground turkey", "lamb", "shrimp", "salmon", "fish", "tilapia", "cod",
        "scallop", "meatball", "taco meat", "carnitas", "al pastor", "deli", "deli meat",
        "deli cheese", "salami", "pepperoni", "prosciutto", "hot dog", "rotisserie", "bread",
        "bun", "roll", "dinner roll", "bagel", "tortilla", "flour tortilla", "corn tortilla",
        "pita", "naan", "baguette", "croissant", "muffin", "english muffin", "cake", "loaf",
        "sliced turkey", "lunch meat",
    ],
    "dry": [
        "rice", "pasta", "spaghetti", "penne", "orzo", "fusilli", "macaroni", "noodle", "ramen",
        "couscous", "quinoa", "oat", "oatmeal", "cereal", "flour", "sugar", "brown sugar",
        "cornstarch", "corn starch", "baking soda", "baking powder", "yeast", "salt", "black pepper",
        "pepper flake", "spice", "paprika", "smoked paprika", "cumin", "chili powder", "oregano",
        "dried thyme", "dried", "cinnamon", "seasoning", "taco seasoning", "bay leaf", "bean",
        "black bean", "pinto bean", "kidney bean", "refried bean", "chickpea", "lentil", "canned",
        "fire-roasted tomato", "fire roasted tomato", "diced tomato", "crushed tomato",
        "tomato paste", "tomato sauce", "marinara", "pasta sauce", "ragu", "salsa", "broth",
        "stock", "chicken broth", "chicken stock", "beef broth", "soup", "cream of chicken soup",
        "oil", "olive oil", "vegetable oil", "cooking spray", "vinegar", "soy sauce",
        "ketchup", "mustard", "mayo", "mayonnaise", "hot sauce", "sriracha", "honey",
        "maple syrup", "syrup", "peanut butter", "jam", "jelly", "nut", "almond", "peanut",
        "walnut", "chip", "tortilla chip", "potato chip", "cracker", "pretzel", "popcorn",
        "granola", "granola bar", "snack", "cookie", "coconut milk", "tuna", "albacore tuna",
        "rice-a-roni", "breadcrumb", "bread crumb", "panko", "raisin", "dried fruit",
        "bouillon", "dressing", "sauce", "condiment", "vanilla", "chocolate chip", "cocoa",
        "enchilada sauce", "taco shell", "evaporated milk", "condensed milk", "pickle", "olive",
        "capers", "sesame", "worcestershire", "bbq sauce", "barbecue sauce", "teriyaki",
    ],
    "dairy": [
        "milk", "whole milk", "egg", "butter", "cheese", "cheddar", "mozzarella", "parmesan",
        "feta", "queso", "queso fresco", "cotija", "cream cheese", "sour cream", "heavy cream",
        "half and half", "half & half", "cream", "yogurt", "greek yogurt", "cottage cheese",
        "ricotta", "string cheese", "shredded cheese", "monterey jack", "pepper jack",
        "creamer",
    ],
    "beverages": [
        "soda", "soda water", "sparkling water", "seltzer", "bottled water", "water", "juice",
        "orange juice", "apple juice", "coffee", "tea", "beer", "wine", "lemonade", "kombucha",
        "la croix", "sports drink", "gatorade", "drink", "coke", "sprite",
    ],
}

_CANNED_UNITS = {"can", "jar", "box", "bottle", "carton", "packet"}


def _kw_pattern(kw: str) -> re.Pattern[str]:
    return re.compile(r"(?<![a-z0-9])" + re.escape(kw) + r"(?:s|es)?(?![a-z0-9])")


_MATCHERS: list[tuple[str, str, re.Pattern[str]]] = [
    (sec, kw, _kw_pattern(kw)) for sec, kws in _KEYWORDS.items() for kw in kws
]


def section_of(name: str, unit: str = "") -> str:
    """File any ingredient name into one of the six section keys (never a catch-all)."""
    s = _clean(name)
    if re.search(r"(?<![a-z])frozen(?![a-z])", s):
        return "frozen"
    best: tuple[int, int, str] | None = None
    for sec, kw, pat in _MATCHERS:
        if pat.search(s):
            cand = (len(kw), -SECTION_KEYS.index(sec), sec)
            if best is None or cand > best:
                best = cand
    sec = best[2] if best else DEFAULT_SECTION
    u = singular_unit(unit)
    if sec == "produce" and u in _CANNED_UNITS:
        return "dry"
    return sec


# ---------------------------------------------------------------- keys


def _clean(s: str) -> str:
    s = s.lower().replace("–", "-").replace("—", "-")
    s = re.sub(r"[^a-z0-9&\-ñé ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _singular(word: str) -> str:
    if len(word) <= 3:
        return word
    if word.endswith("ies"):
        return word[:-3] + "y"
    if word.endswith("oes"):
        return word[:-2]
    if re.search(r"(ches|shes|xes|sses)$", word):
        return word[:-2]
    if word.endswith("s") and not word.endswith("ss"):
        return word[:-1]
    return word


def item_key(name: str) -> str:
    """Stable key for a list item: cleaned, lowercased, last word singular."""
    words = _clean(name).split(" ")
    if words and words[-1]:
        words[-1] = _singular(words[-1])
    return " ".join(w for w in words if w)


# ---------------------------------------------------------------- quantities

_UNIT_ALIASES = {
    "lbs": "lb", "pound": "lb", "pounds": "lb", "ounce": "oz", "ounces": "oz",
    "boxes": "box", "bunches": "bunch", "loaves": "loaf", "tablespoon": "tbsp",
    "tablespoons": "tbsp", "teaspoon": "tsp", "teaspoons": "tsp", "packages": "package",
    "pkg": "package", "pkgs": "package", "gallons": "gallon", "gal": "gallon",
}
_PLURALIZE = {
    "lb", "can", "jar", "bag", "cup", "ear", "head", "bunch", "block", "tray", "clove", "box",
    "package", "pack", "bottle", "loaf", "container", "carton", "slice", "stick", "piece",
    "gallon", "quart", "pint", "fillet", "link", "sleeve",
}
_PLURALS = {"bunch": "bunches", "box": "boxes", "loaf": "loaves", "lb": "lbs"}

_NUM = r"(?:\d+\s+\d+/\d+|\d+/\d+|\d+[½¼¾⅓⅔]|\d+(?:\.\d+)?|\.\d+|[½¼¾⅓⅔])"


def singular_unit(u: str) -> str:
    u = u.strip().lower().rstrip(".")
    if u in _UNIT_ALIASES:
        return _UNIT_ALIASES[u]
    if u.endswith("s") and not u.endswith("ss") and len(u) > 2:
        return u[:-1]
    return u


def _to_float(num: str) -> float | None:
    num = num.strip()
    frac = {"½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3}
    if num in frac:
        return frac[num]
    if num and num[-1] in frac:
        return float(num[:-1]) + frac[num[-1]]
    try:
        if " " in num:
            whole, f = num.split(None, 1)
            a, b = f.split("/")
            return float(whole) + float(a) / float(b)
        if "/" in num:
            a, b = num.split("/")
            return float(a) / float(b)
        return float(num)
    except (ValueError, ZeroDivisionError):
        return None


def _fmt_num(n: float) -> str:
    n = round(n * 100) / 100
    return str(int(n)) if n == int(n) else f"{n:g}"


def _parse_part(q: str) -> tuple[float, str] | None:
    mt = re.match(rf"^({_NUM})\s*(.*)$", q.strip())
    if not mt:
        return None
    n = _to_float(mt.group(1))
    if n is None:
        return None
    return n, mt.group(2).strip()


def _fmt_part(n: float, unit_singular: str, original_unit: str) -> str:
    if not unit_singular:
        return _fmt_num(n)
    if n > 1 and unit_singular in _PLURALIZE:
        u = _PLURALS.get(unit_singular, unit_singular + "s")
    elif unit_singular in _PLURALIZE or unit_singular in _UNIT_ALIASES.values():
        u = unit_singular
    else:
        u = original_unit
    return f"{_fmt_num(n)} {u}"


def add_qty(a: str | None, b: str | None) -> str:
    """Sum two quantity strings: same unit is summed, different units joined with " + "."""
    parts: list[str] = []
    for q in (a, b):
        if q:
            parts.extend(p.strip() for p in str(q).split(" + ") if p.strip())
    out: list[list[Any]] = []  # [n, unit_singular, original_unit] or [text]
    for p in parts:
        parsed = _parse_part(p)
        if parsed is None:
            out.append([p])
            continue
        n, unit = parsed
        us = singular_unit(unit)
        for o in out:
            if len(o) == 3 and o[1] == us:
                o[0] += n
                break
        else:
            out.append([n, us, unit])
    return " + ".join(o[0] if len(o) == 1 else _fmt_part(o[0], o[1], o[2]) for o in out)


def join_qty(qty: str | None, unit: str | None) -> str:
    return " ".join(x for x in [(qty or "").strip(), (unit or "").strip()] if x)


# ---------------------------------------------------------------- free text

_UNIT_WORDS = sorted(
    {
        "lb", "lbs", "pound", "pounds", "oz", "ounce", "ounces", "g", "kg", "can", "cans", "jar",
        "jars", "bag", "bags", "box", "boxes", "bunch", "bunches", "head", "heads", "cup", "cups",
        "tbsp", "tsp", "clove", "cloves", "ear", "ears", "block", "blocks", "tray", "trays",
        "pack", "packs", "package", "packages", "pkg", "bottle", "bottles", "gallon", "gallons",
        "gal", "half gallon", "quart", "quarts", "pint", "pints", "dozen", "loaf", "loaves",
        "container", "containers", "carton", "cartons", "ct", "count", "piece", "pieces", "stick",
        "sticks", "slice", "slices", "fillet", "fillets", "sleeve", "sleeves",
    },
    key=len,
    reverse=True,
)
_WORD_NUMS = {"a": "1", "an": "1", "one": "1", "two": "2", "three": "3", "four": "4",
              "five": "5", "six": "6", "half": "0.5", "a half": "0.5"}


@dataclass
class ParsedItem:
    qty: str | None
    name: str
    section: str


def parse_free_text(text: str) -> ParsedItem:
    """Parse quick-add text: "2 lbs apples" -> qty "2 lbs", name "apples", Produce."""
    t = re.sub(r"\s+", " ", text.strip())
    qty: str | None = None
    unit = ""
    # trailing multiplier: "milk x2"
    mt = re.match(r"^(.*?)\s*[x×]\s*(\d+)$", t, re.I)
    if mt and mt.group(1):
        t, qty = mt.group(1), mt.group(2)
    else:
        words = "|".join(map(re.escape, sorted(_WORD_NUMS, key=len, reverse=True)))
        num_re = rf"(?:{_NUM}(?:\s*[-–]\s*{_NUM})?(?=[\s a-z])|(?:{words})(?=\s))"
        unit_re = "|".join(re.escape(u) for u in _UNIT_WORDS)
        mt = re.match(rf"^({num_re})\s*(?:({unit_re})\.?(?![a-z]))?\s*(?:of\s+)?(.+)$", t, re.I)
        if mt and not mt.group(2) and not t[mt.end(1):mt.end(1) + 1].isspace():
            mt = None  # "7up", not a quantity
        if mt:
            num, unit_m, rest = mt.group(1), mt.group(2), mt.group(3)
            n = _WORD_NUMS.get(num.lower(), num)
            unit = unit_m or ""
            qty = join_qty(n, unit)
            t = rest
    name = t.strip(" ,.-")
    if not name:
        name = text.strip()
        qty = None
    return ParsedItem(qty=qty or None, name=name, section=section_of(name, unit))


# ---------------------------------------------------------------- derivation


@dataclass
class Item:
    key: str
    name: str
    qty: str | None
    section: str
    note: str | None = None
    sources: list[dict[str, Any]] = field(default_factory=list)
    sale: str | None = None
    staple: bool = False
    from_: str | None = None
    added: bool = False
    edited: bool = False
    checked: bool = False
    checked_by: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "key": self.key, "name": self.name, "qty": self.qty, "section": self.section,
            "note": self.note, "sources": self.sources, "sale": self.sale, "staple": self.staple,
            "from": self.from_, "added": self.added, "edited": self.edited,
            "checked": self.checked, "checked_by": self.checked_by,
        }


DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
LIST_SLOT_KINDS = {"cook", "leidy"}


def slot_ingredients(slot: m.Slot) -> list[dict[str, Any]]:
    if slot.ingredients_override is not None:
        return list(slot.ingredients_override)
    return list(slot.recipe.ingredients or []) if slot.recipe else []


def slot_short(slot: m.Slot) -> str:
    r = slot.recipe
    return (r.short_title or r.title) if r else (slot.text or "")


def _staple_on_hand(staple_key: str, pantry_keys: list[set[str]]) -> bool:
    words = set(staple_key.split())
    return any(words <= pk for pk in pantry_keys)


def plan_items(db: Session, week: m.Week) -> dict[str, Item]:
    """Items from the plan alone: cook slots + staples (before adds/edits)."""
    items: dict[str, Item] = {}
    slots = sorted(week.slots, key=lambda s: DAY_ORDER.index(s.day))
    for slot in slots:
        if slot.kind not in LIST_SLOT_KINDS or slot.recipe is None or slot.status == "rejected":
            continue
        flags = slot.ingredient_flags or {}
        short = slot_short(slot)
        for ing in slot_ingredients(slot):
            name = ing.get("name", "").strip()
            if not name:
                continue
            k = item_key(name)
            flag = flags.get(k) or flags.get(name.lower()) or {}
            if flag.get("have"):
                continue
            qty = join_qty(ing.get("qty"), ing.get("unit")) or None
            src = {"slot_id": slot.id, "day": slot.day, "recipe_id": slot.recipe.id, "title": short}
            if k in items:
                it = items[k]
                it.qty = add_qty(it.qty, qty) or None
                if short and short not in (it.note or "").split(" + "):
                    it.note = f"{it.note} + {short}" if it.note else short
                it.sources.append(src)
                it.sale = it.sale or flag.get("sale")
            else:
                items[k] = Item(
                    key=k, name=name, qty=qty, section=section_of(name, ing.get("unit", "")),
                    note=short or None, sources=[src], sale=flag.get("sale"),
                )

    pantry_keys = [
        set(item_key(p.name).split())
        for p in db.scalars(select(m.PantryItem).where(m.PantryItem.state == "confirmed"))
    ]
    for st in db.scalars(select(m.Staple).where(m.Staple.active.is_(True)).order_by(m.Staple.id)):
        k = item_key(st.name)
        if k in items or _staple_on_hand(k, pantry_keys):
            continue
        items[k] = Item(key=k, name=st.name, qty=None, section=st.section or section_of(st.name),
                        staple=True, from_=st.from_)
    return items


def derive_items(db: Session, week: m.Week) -> list[Item]:
    items = plan_items(db, week)
    for add in db.scalars(select(m.ListAdd).where(m.ListAdd.week_id == week.id).order_by(m.ListAdd.id)):
        k = f"add-{add.id}"
        items[k] = Item(key=k, name=add.name, qty=add.qty, section=add.section, note=add.note,
                        from_=add.from_, added=True)
    for e in db.scalars(select(m.ListEdit).where(m.ListEdit.week_id == week.id)):
        it = items.get(e.item_key)
        if it is None:
            continue
        if e.removed:
            del items[e.item_key]
            continue
        if e.qty is not None:
            it.qty = e.qty or None
        if e.name is not None:
            it.name = e.name
        if e.note is not None:
            it.note = e.note or None
        if e.section is not None:
            it.section = e.section
        it.edited = True
    checks = {c.item_key: c for c in db.scalars(select(m.ListCheck).where(m.ListCheck.week_id == week.id))}
    for k, it in items.items():
        if k in checks:
            it.checked = True
            it.checked_by = checks[k].checked_by
        if it.section not in SECTION_KEYS:
            it.section = DEFAULT_SECTION
    return list(items.values())


def group_sections(items: list[Item]) -> list[dict[str, Any]]:
    return [
        {**sec, "items": [i.as_dict() for i in items if i.section == sec["key"]]}
        for sec in SECTIONS
    ]


# ---------------------------------------------------------------- snapshot and diff


def _snap(items: dict[str, Item] | list[Item]) -> list[dict[str, Any]]:
    vals = items.values() if isinstance(items, dict) else items
    return [{"key": i.key, "name": i.name, "qty": i.qty, "section": i.section} for i in vals]


def snapshot(db: Session, week: m.Week) -> dict[str, Any]:
    """What gets stored in weeks.approved_list on approval (and on confirm)."""
    return {"plan": _snap(plan_items(db, week)), "items": _snap(derive_items(db, week))}


def diff(db: Session, week: m.Week) -> list[dict[str, Any]]:
    """Plan changes since approval: the plan-derived list vs the approved snapshot.

    Quick adds and manual edits are the person's own changes and are not part of
    the diff; slot swaps, moves, rejections and ingredient edits are.
    """
    if not week.approved_list:
        return []
    before = {i["key"]: i for i in week.approved_list.get("plan", [])}
    now = {i.key: i for i in plan_items(db, week).values()}
    out: list[dict[str, Any]] = []
    for k, it in now.items():
        if k not in before:
            out.append({"change": "added", "key": k, "name": it.name, "section": it.section,
                        "qty": it.qty, "previous_qty": None})
        elif (before[k].get("qty") or None) != (it.qty or None):
            out.append({"change": "changed", "key": k, "name": it.name, "section": it.section,
                        "qty": it.qty, "previous_qty": before[k].get("qty")})
    for k, b in before.items():
        if k not in now:
            out.append({"change": "removed", "key": k, "name": b["name"], "section": b["section"],
                        "qty": None, "previous_qty": b.get("qty")})
    order = {s: i for i, s in enumerate(SECTION_KEYS)}
    out.sort(key=lambda d: (order.get(d["section"], 99), {"removed": 0, "changed": 1, "added": 2}[d["change"]]))
    return out


# ---------------------------------------------------------------- text export


def as_text(items: list[Item], title: str, include_checked: bool = False) -> str:
    lines = [title, ""]
    for sec in SECTIONS:
        rows = [i for i in items if i.section == sec["key"] and (include_checked or not i.checked)]
        if not rows:
            continue
        lines.append(sec["label"])
        for i in rows:
            mark = "☑" if i.checked else "☐"
            lines.append(f"{mark} {' '.join(x for x in [i.qty, i.name] if x)}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"
