"""Demo data from design_handoff_cafe_lauren_app/ui_kits/mobile/data.js.

    uv run python -m cafe.seed_demo            # fill the current week (refuses if recipes exist)
    uv run python -m cafe.seed_demo --reset    # wipe household data first, then fill

People, stores and settings come from the migration and are kept.
"""

from __future__ import annotations

import argparse
import re
import shutil
from datetime import date, datetime, time, timedelta

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from . import models as m
from .config import REPO_ROOT, Settings, get_settings
from .db import Database, run_migrations
from .services import grocery
from .services import weeks as W

PHOTO_SRC = REPO_ROOT / "design_handoff_cafe_lauren_app" / "assets" / "photos"

SALE = {
    "marinated pork taco meat": "$3.49/lb", "sweet corn": "3/$1", "queso fresco 10 oz": "$1.99",
    "salsa": "On sale", "center-cut pork chops": "$2.29/lb", "yukon gold potatoes": "$0.99/lb",
    "xl shrimp 16/20": "$9.99/lb", "lemons": "$0.99/lb", "atlantic salmon fillet": "$8.99/lb",
    "marinara": "2/$5", "black beans": "2/$5", "baby bok choy": "$1.49", "ground pork": "$2.99/lb",
}

# key: (title, short, description, method, minutes, healthy, delicious, cost, stars, why, leftovers, ingredients)
MEALS: dict[str, dict] = {
    "tacos": dict(title="Taco Tuesday", short="Tacos", description="Al pastor pork tacos with queso fresco, lettuce, tomato, salsa — with black beans and sweet corn sides.", method="Skillet", total=30, healthy=7, delicious=9, cost=22, stars=5, why=["5-star family favorite", "Al pastor pork on sale, $3.49/lb", "Leftovers cover Tuesday"], leftovers="Tue: taco-salad bowls with beans, corn, crushed chips", ings=[["2 lbs", "marinated pork taco meat", "sale"], ["12", "small tortillas", "list"], ["1 head", "lettuce", "list"], ["1", "queso fresco 10 oz", "sale"], ["1 jar", "salsa", "sale"], ["1 can", "black beans", "list"], ["6 ears", "sweet corn", "sale"]]),
    "chops": dict(title="Sheet Pan Pork Chops with Roasted Veggies", short="Pork chops", description="Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.", method="Sheet pan", total=40, healthy=8, delicious=8, cost=18, stars=None, why=["Pork chops on sale, $2.29/lb", "One pan, 10 min hands-on", "Yukon golds 99¢/lb"], leftovers="Slice over a green salad, or chop into fried rice", ings=[["5", "center-cut pork chops", "sale"], ["1.5 lbs", "Yukon gold potatoes", "sale"], ["1 lb", "green beans", "list"], ["1", "white onion", "list"], ["2 tsp", "smoked paprika", "have"], ["1 tsp", "dried thyme", "have"], ["3 tbsp", "olive oil", "have"]]),
    "shrimp": dict(title="Basil Shrimp with Feta and Orzo", short="Basil shrimp", description="Warm orzo tossed with tomatoes, green onion, basil, lemon, feta and sautéed shrimp.", method="Skillet", total=30, healthy=8, delicious=9, cost=26, stars=5, why=["Joe asked for it Monday", "XL shrimp on sale, $9.99/lb", "5-star favorite"], leftovers="Sat lunch: serve cold as an orzo salad", ings=[["1.5 lbs", "XL shrimp 16/20", "sale"], ["1 lb", "orzo", "list"], ["1.5 lbs", "ripe tomatoes", "list"], ["1 bunch", "fresh basil", "list"], ["6 oz", "feta", "list"], ["2", "lemons", "sale"]]),
    "chicken": dict(title="Sheet Pan Citrus Chicken Thighs", short="Citrus chicken", description="Boneless thighs roasted with orange and lemon, garlic, Roma tomatoes and green beans.", method="Sheet pan", total=45, healthy=8, delicious=8, cost=20, stars=None, why=["Lemons 99¢/lb", "Makes 2 days of leftovers", "Favorite protein: thighs"], leftovers="Sun: shred into wraps with deli cheese", ings=[["2 lbs", "boneless chicken thighs", "list"], ["2", "navel oranges", "list"], ["1 lb", "Roma tomatoes", "list"], ["1 lb", "green beans", "list"], ["1 head", "garlic", "list"]]),
    "salmon": dict(title="Sheet Pan Salmon with Lemon Potatoes", short="Salmon", description="Salmon fillets roasted over crispy lemon potatoes and green beans.", method="Sheet pan", total=35, healthy=9, delicious=8, cost=30, stars=None, why=["You asked for salmon on Wednesday", "Atlantic salmon on sale, $8.99/lb", "Same pan and sides as the pork chops"], leftovers="Flake into rice bowls with cucumber", ings=[["2.5 lbs", "Atlantic salmon fillet", "sale"], ["1.5 lbs", "Yukon gold potatoes", "sale"], ["1 lb", "green beans", "list"], ["2", "lemons", "sale"]]),
    "meatballs": dict(title="Instant Pot Meatballs and Marinara", short="Meatballs", description="Frozen Italian meatballs simmered in marinara over spaghetti, with a big salad.", method="Instant Pot", total=25, healthy=6, delicious=8, cost=12, stars=3, why=["Uses the meatballs in the freezer", "Ragu 2/$5 this week", "Lowest effort option"], leftovers="Meatball subs with deli cheese", ings=[["1 tray", "Italian meatballs", "have"], ["1 jar", "marinara", "sale"], ["1 lb", "spaghetti", "have"], ["1 bag", "salad greens", "list"]]),
    "soup": dict(title="Instant Pot Chicken Tortilla Soup", short="Tortilla soup", description="Rich, spiced chicken soup with black beans, corn, and all the Tex-Mex toppings.", method="Instant Pot", total=35, healthy=8, delicious=9, cost=14, stars=5, why=["5-star favorite, last made in March", "Black beans 2/$5", "Two days of leftovers"], leftovers="Pour over rice for a tortilla soup bowl", ings=[["2.5 lbs", "chicken thighs", "list"], ["1 can", "black beans", "sale"], ["1 can", "fire-roasted tomatoes", "list"], ["4 cups", "chicken broth", "list"], ["2", "avocados", "list"]]),
    "tofu": dict(title="Bok Choy and Tofu Stir Fry", short="Tofu stir fry", description="Crispy tofu, baby bok choy and garlic in a quick ginger-soy sauce over rice.", method="Skillet", total=25, healthy=9, delicious=7, cost=11, stars=None, why=["Vegetarian, as asked", "Baby bok choy on sale, $1.49", "Uses rice on hand"], leftovers="Fried rice with an egg", ings=[["2 blocks", "extra-firm tofu", "list"], ["4", "baby bok choy", "sale"], ["3 cloves", "garlic", "list"], ["2 cups", "rice", "have"]]),
    "stirfry": dict(title="Pork and Bok Choy Stir Fry", short="Stir fry", description="Ground pork, baby bok choy and garlic in a quick ginger-soy sauce over rice.", method="Skillet", total=20, healthy=8, delicious=7, cost=13, stars=None, why=["Quickest option, 20 min", "Ground pork $2.99/lb, bok choy $1.49", "Uses rice on hand"], leftovers="Fried rice with an egg", ings=[["2 lbs", "ground pork", "sale"], ["4", "baby bok choy", "sale"], ["3 cloves", "garlic", "list"], ["2 cups", "rice", "have"]]),
}

# Recipe box (data.js recipes): key -> (title, stars, method, minutes, last made, tags)
BOX = {
    "tacos": ("Taco Tuesday", 5, "Skillet", 30, date(2026, 8, 24), ["Quick"]),
    "chili": ("Lauren's Chili", 5, "Le Creuset", 60, date(2026, 2, 23), []),
    "soup": ("Instant Pot Chicken Tortilla Soup", 5, "Instant Pot", 35, date(2026, 3, 9), ["Instant Pot"]),
    "shrimp": ("Basil Shrimp with Feta and Orzo", 5, "Skillet", 30, date(2026, 8, 28), ["Quick"]),
    "couscous": ("Mediterranean Couscous Salad with Grilled Chicken", 4, "Skillet", 25, date(2026, 3, 9), ["Quick"]),
    "lecreuset": ("Le Creuset Chicken", 4, "Le Creuset", 45, date(2026, 1, 30), []),
    "arroz": ("Arroz con Pollo", 4, "Le Creuset", 55, date(2026, 3, 1), ["Leidy's"]),
    "meatballs": ("Instant Pot Meatballs and Marinara", 3, "Instant Pot", 25, date(2026, 2, 2), ["Instant Pot", "Quick"]),
}

STEPS = {
    "chops": [
        {"group": "Roast the Vegetables", "steps": [
            "Heat the oven to 425°F. Toss **1.5 lbs quartered potatoes** and **1 onion, in wedges** with **2 tbsp olive oil**, salt and pepper.",
            "Spread on a sheet pan and roast until the edges brown, about 15 min."]},
        {"group": "Add the Chops", "steps": [
            "Rub **5 pork chops** with **1 tbsp olive oil**, **2 tsp smoked paprika** and **1 tsp dried thyme**.",
            "Push potatoes aside; add chops and **1 lb green beans**. Roast to 145°F, about 15 min.",
            "Rest 5 minutes. Save 2 chops for tomorrow."]},
    ],
    "shrimp": [
        {"group": "Cook the Orzo", "steps": [
            "Boil **1 lb orzo** in salted water until al dente; drain and keep warm."]},
        {"group": "Sauté the Shrimp", "steps": [
            "In a large skillet, heat a **bit of olive oil** over medium-high heat.",
            "Add **1.5 lbs XL shrimp** and cook until pink, 2–3 min a side.",
            "Toss in **1.5 lbs chopped tomatoes**, the orzo, **1 bunch torn basil** and the juice of **2 lemons**.",
            "Finish with **6 oz crumbled feta**."]},
    ],
}

SLOTS = [
    dict(day="mon", meal="tacos", kind="cook", status="kept", by="lauren", votes={"lauren": "up", "joe": "up"}),
    dict(day="tue", kind="leftover", text="Taco leftovers → taco-salad bowls"),
    dict(day="wed", meal="chops", kind="cook", status="suggested", votes={"joe": "up"}),
    dict(day="thu", kind="leidy", text="Leidy cooks", cook="leidy"),
    dict(day="fri", meal="shrimp", kind="cook", status="kept", by="joe", votes={"lauren": "up", "joe": "up", "leidy": "up"}),
    dict(day="sat", meal="chicken", kind="cook", status="suggested", votes={"lauren": "up", "joe": "down"}),
    dict(day="sun", kind="leftover", text="Chicken leftovers → wraps"),
]

REQUESTS = [
    ("joe", "meal", "Can we do the basil shrimp again? The kids actually ate it.", 0, "planned", "Planned for Friday"),
    ("leidy", "out", "Out of cornstarch and the big yogurt", 1, "planned", "Added to the list"),
    ("lauren", "meal", "Something with salmon — it was on sale last time", 2, "new", None),
    ("joe", "out", "Soda water", 3, "new", None),
    ("leidy", "meal", "I can make arroz con pollo Thursday", 3, "new", None),
]

PHOTOS = [("pantry-1.jpg", "Pantry shelf"), ("pantry-2.jpg", "Pantry, lower"), ("pantry-3.jpg", "Freezer")]

PANTRY = [  # area, name, qty, sure, note, photo index
    ("Freezer", "Chicken breasts", "~2 lbs", True, None, 2),
    ("Freezer", "Cooked shrimp, 26–30 count", "1 lb bag", True, None, 2),
    ("Freezer", "Italian style meatballs", "1 tray", True, None, 2),
    ("Freezer", "Peas & carrots", "1 bag", True, None, 2),
    ("Freezer", "Ground taco meat?", "1 package", False, "Purple and yellow package, right side", 2),
    ("Pantry", "Rice-A-Roni, chicken", "1–2 boxes", False, None, 0),
    ("Pantry", "Zatarain's yellow rice", "1 box", True, None, 0),
    ("Pantry", "Albacore tuna", "1 can", True, None, 1),
    ("Pantry", "Barilla spaghetti", "1 box", True, None, 1),
    ("Pantry", "Cream of chicken soup", "1 can", True, None, 1),
]

STAPLES = [("Bananas", None), ("Eggs", None), ("Milk", None), ("Bread", None), ("Frozen fruit", None),
           ("Soda water", "joe"), ("Yogurt", "leidy"), ("Cornstarch", "leidy")]

DEALS = {
    "cermak": [
        ("Marinated Pork Taco Meat (al pastor)", "$3.49", "lb"), ("Center Cut Pork Chops", "$2.29", "lb"),
        ("Ground Pork", "$2.99", "lb"), ("Chicken Drumsticks", "$0.89", "lb"), ("XL Cooked Shrimp 16/20", "$9.99", "lb"),
        ("Atlantic Salmon Fillet", "$8.99", "lb"), ("Sweet Corn", "3/$1", None), ("Yukon Gold Potatoes", "$0.99", "lb"),
        ("Lemons", "$0.99", "lb"), ("Limes", "10/$1", None), ("Baby Bok Choy", "$1.49", "ea"),
        ("Goya Black Beans 29 oz", "2/$5", None), ("Ragu Pasta Sauce 24 oz", "2/$5", None),
        ("Queso Fresco 10 oz", "$1.99", "ea"), ("Salsa", "$2.49", "ea"),
    ],
    "aldi": [
        ("Boneless Chicken Thighs", "$2.49", "lb"), ("Strawberries 1 lb", "$1.89", "ea"),
        ("Avocados, bag of 4", "$2.99", "ea"), ("Large Eggs, dozen", "$2.15", "ea"), ("Greek Yogurt 32 oz", "$3.99", "ea"),
    ],
}

CHAT = [
    ("lauren", "me", "Make Thursday vegetarian", None),
    ("lauren", "cafe", "Thursday is Leidy's night. If she's open to it, here's a vegetarian option that uses what's on sale. It replaces nothing until you apply it.",
     {"day": "thu", "recipe": "tofu", "label": "Thursday → Bok Choy and Tofu Stir Fry",
      "detail": "Vegetarian. Tofu, bok choy, garlic over rice. 25 min, ~$11.", "state": "pending"}),
]

HOUSEHOLD_TABLES = [m.ChatMessage, m.Vote, m.ListCheck, m.ListEdit, m.ListAdd, m.QueueEntry, m.Request,
                    m.PantryItem, m.PantryPhoto, m.Staple, m.Deal, m.Feedback, m.CookLog, m.Job, m.Slot,
                    m.Week, m.Recipe]


def _split_qty(q: str) -> tuple[str, str]:
    mt = re.match(r"^([\d.½/]+)\s*(.*)$", q)
    return (mt.group(1), mt.group(2)) if mt else (q, "")


def reset(db: Session) -> None:
    for t in HOUSEHOLD_TABLES:
        db.execute(delete(t))
    for key in ("pantry_confirmed_at", "pantry_confirmed_by"):
        db.execute(delete(m.Setting).where(m.Setting.key == key))
    db.flush()


def seed(db: Session, settings: Settings, monday: date | None = None, copy_photos: bool = True) -> m.Week:
    monday = monday or W.monday_of(W.today(settings.cafe_timezone))
    now = m.utcnow()

    recipes: dict[str, m.Recipe] = {}
    for key, d in MEALS.items():
        box = BOX.get(key)
        ings = []
        for q, name, _tag in d["ings"]:
            qty, unit = _split_qty(q)
            ings.append({"qty": qty, "unit": unit, "name": name, "group": None})
        r = m.Recipe(
            title=d["title"], short_title=d["short"], description=d["description"], method=d["method"],
            total_min=d["total"], cost_usd=float(d["cost"]), healthy=d["healthy"], delicious=d["delicious"],
            stars=d["stars"], tags=box[5] if box else [], ingredients=ings, steps=STEPS.get(key, []),
            leftovers=d["leftovers"], source="imported" if box else "ai", status="saved" if box else "draft",
            last_made=box[4] if box else None,
        )
        db.add(r)
        recipes[key] = r
    for key, (title, stars, method, mins, last, tags) in BOX.items():
        if key in recipes:
            continue
        r = m.Recipe(title=title, method=method, total_min=mins, stars=stars, tags=tags, last_made=last,
                     source="imported", status="saved", ingredients=[], steps=[])
        db.add(r)
        recipes[key] = r
    db.flush()

    week = W.get_or_create_week(db, monday)
    week.store_id = db.scalar(select(m.Store.id).where(m.Store.key == "cermak"))
    week.order_via = "delivery"
    for spec in SLOTS:
        sl = W.slot_by_day(week, spec["day"])
        sl.kind = spec["kind"]
        sl.text = spec.get("text")
        sl.status = spec.get("status")
        sl.by = spec.get("by")
        sl.cook = spec.get("cook")
        meal = spec.get("meal")
        if meal:
            d = MEALS[meal]
            sl.recipe_id = recipes[meal].id
            sl.why = list(d["why"])
            sl.ingredient_flags = {
                grocery.item_key(name): {"have": tag == "have",
                                         "sale": SALE.get(name.lower(), "On sale") if tag == "sale" else None}
                for _q, name, tag in d["ings"] if tag in ("have", "sale")
            }
        for person, val in spec.get("votes", {}).items():
            sl.votes.append(m.Vote(person=person, value=val))
    db.flush()

    db.add(m.QueueEntry(recipe_id=recipes["soup"].id, by="joe"))

    for who, typ, text, offset, status, reply in REQUESTS:
        when = min(datetime.combine(monday + timedelta(days=offset), time(9, 0)) + timedelta(minutes=offset), now)
        db.add(m.Request(who=who, type=typ, text=text, status=status, reply=reply, week_id=week.id,
                         created_at=when, updated_at=when))

    photo_rows = []
    for fname, label in PHOTOS:
        rel = f"pantry/demo/{fname}"
        src = PHOTO_SRC / fname
        if copy_photos and src.exists():
            dest = settings.cafe_media_dir / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)
        p = m.PantryPhoto(path=rel, label=label, uploaded_by="joe", read_at=now)
        db.add(p)
        photo_rows.append(p)
    db.flush()
    for area, name, qty, sure, note, pi in PANTRY:
        db.add(m.PantryItem(area=area, name=name, qty=qty, state="found" if sure else "unsure", note=note,
                            photo_id=photo_rows[pi].id))

    for name, frm in STAPLES:
        db.add(m.Staple(name=name, section=grocery.section_of(name), from_=frm, active=True))

    for store_key, deals in DEALS.items():
        sid = db.scalar(select(m.Store.id).where(m.Store.key == store_key))
        for item, price, unit in deals:
            db.add(m.Deal(store_id=sid, valid_from=monday - timedelta(days=5), valid_to=monday + timedelta(days=8),
                          item=item, price=price, unit=unit, section=grocery.section_of(item),
                          source_image="ads/cermak/demo/weekly-ad-1.jpg" if store_key == "cermak" else None))

    for who, frm, text, proposal in CHAT:
        if proposal:
            proposal = dict(proposal)
            proposal["recipe_id"] = recipes[proposal.pop("recipe")].id
        db.add(m.ChatMessage(who=who, from_=frm, text=text, proposal=proposal, week_id=week.id))
    db.flush()
    return week


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--reset", action="store_true", help="delete household data first")
    ap.add_argument("--monday", type=date.fromisoformat, help="week to fill (default: this week)")
    args = ap.parse_args(argv)
    settings = get_settings()
    run_migrations(settings.cafe_db_path)
    db = Database(settings)
    with db.session() as s:
        if args.reset:
            reset(s)
        elif s.scalar(select(m.Recipe.id).limit(1)) is not None:
            raise SystemExit("Database already has recipes. Use --reset to replace them with demo data.")
        week = seed(s, settings, args.monday)
        print(f"Seeded demo {W.week_label(week.monday)} ({week.monday}) into {settings.cafe_db_path}")
    db.dispose()


if __name__ == "__main__":
    main()
