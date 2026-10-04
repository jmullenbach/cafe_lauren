from __future__ import annotations

import importlib.util
import json
import shutil
import sys
from datetime import date
from pathlib import Path

import pytest
from sqlalchemy import func, select

from cafe import models as m
from cafe.config import Settings
from cafe.db import Database, run_migrations

FIX = Path(__file__).parent / "fixtures" / "notion"
MENUS = FIX / "menus"

_spec = importlib.util.spec_from_file_location(
    "import_notion", Path(__file__).resolve().parents[2] / "scripts" / "import_notion.py"
)
imp = importlib.util.module_from_spec(_spec)
sys.modules["import_notion"] = imp
_spec.loader.exec_module(imp)


@pytest.fixture
def db_path(tmp_path):
    p = tmp_path / "imp.db"
    run_migrations(p)
    return p


@pytest.fixture
def database(db_path):
    d = Database(Settings(_env_file=None, cafe_db_path=db_path))
    yield d
    d.dispose()


def run(database, menus=MENUS, fixtures=FIX, rollback=False):
    s = database.SessionLocal()
    try:
        rep = imp.run_import(s, imp.FixtureSource(fixtures), menus)
        s.rollback() if rollback else s.commit()
        return rep
    finally:
        s.close()


def counts(database):
    with database.session() as s:
        return {t.__tablename__: s.scalar(select(func.count()).select_from(t))
                for t in (m.Recipe, m.Staple, m.Week, m.Slot)}


def recipe(database, title):
    with database.session() as s:
        return s.scalar(select(m.Recipe).where(m.Recipe.title == title))


def test_recipe_fields(database):
    run(database)
    r = recipe(database, "Taco Tuesday")
    assert (r.source, r.status, r.stars) == ("imported", "saved", 5)
    assert r.description.startswith("Al pastor pork tacos")
    assert (r.prep_min, r.cook_min, r.total_min) == (10, 20, 30)
    assert (r.healthy, r.delicious, r.cost_usd) == (7, 9, 22.0)
    assert r.tags == ["notion:11111111-1111-1111-1111-111111111111"]  # day tag dropped
    assert r.ingredients[0] == {"qty": "2", "unit": "lbs", "name": "al pastor pork taco meat", "group": None}
    assert [g["group"] for g in r.steps] == ["Cook the Pork", "Build the Tacos"]
    assert "**2 lbs al pastor pork**" in r.steps[0]["steps"][0]
    assert r.leftovers.startswith("Day 2")


def test_groups_multiselect_tags_and_time(database):
    run(database)
    r = recipe(database, "Lauren's Chili")
    assert "Kid Friendly" in r.tags and not any(t.startswith("7.") for t in r.tags)
    assert r.total_min == 75 and r.cost_usd == 16.5
    assert {i["group"] for i in r.ingredients} == {"For the Chili", "For Serving"}
    assert [g["group"] for g in r.steps] == ["Brown the Beef", "Simmer"]
    assert r.leftovers.splitlines() == ["Day 2: chili-topped baked potatoes", "Day 3: chili mac"]


def test_property_ingredients_and_select_stars(database):
    run(database)
    pork = recipe(database, "Sheet Pan Pork Chops with Roasted Veggies")
    assert [i["name"] for i in pork.ingredients][:2] == ["bone-in pork chops", "Yukon gold potatoes"]
    assert pork.ingredients[1]["qty"] == "1 1/2" and pork.ingredients[1]["unit"] == "lbs"
    assert pork.total_min == 40 and pork.healthy == 8
    assert recipe(database, "Basil Shrimp with Feta and Orzo").stars == 5


def test_staples_imported_as_tagged_recipe(database):
    rep = run(database)
    r = recipe(database, "Staples")
    assert r.tags == ["Staples"] and r.status == "saved"
    names = [i["name"] for i in r.ingredients]
    assert "Eggs" in names and "Bananas" in names
    assert "Butter" in names  # " — ON SALE" suffix stripped
    assert "Shredded cheese" in names and "Frozen peas" in names
    assert rep.staples_created == len(names)


def test_menu_weeks_and_slots(database):
    rep = run(database)
    with database.session() as s:
        wk = s.scalar(select(m.Week).where(m.Week.monday == date(2026, 3, 9)))
        slots = {x.day: x for x in wk.slots}
        prev = s.scalar(select(m.Week).where(m.Week.monday == date(2026, 3, 2)))
        sun = next(x for x in prev.slots if x.day == "sun")  # Sun Mar 8 belongs to the Mar 2 week
        assert sun.recipe.title == "Instant Pot Chicken Tortilla Soup"
        assert slots["tue"].kind == "leidy" and slots["tue"].text.startswith("Leidy #1")
        assert slots["mon"].kind == "leftover" and slots["mon"].text
        assert slots["wed"].text == "Couscous Feta Chicken Salad"  # no such recipe imported
        assert all(x.status == "approved" for x in wk.slots)
        aug = s.scalar(select(m.Week).where(m.Week.monday == date(2026, 8, 24)))
        mon = next(x for x in aug.slots if x.day == "mon")
        assert mon.recipe.title == "Taco Tuesday"
        fri = next(x for x in aug.slots if x.day == "fri")
        assert fri.recipe.title == "Basil Shrimp with Feta and Orzo"
        # last_made is the latest week the recipe appears in
        assert recipe(database, "Taco Tuesday").last_made == date(2026, 8, 24)
        assert recipe(database, "Instant Pot Chicken Tortilla Soup").last_made == date(2026, 3, 8)
    assert rep.slots_matched >= 4 and rep.slots_text >= 4


def test_idempotent(database):
    run(database)
    first = counts(database)
    with database.session() as s:
        snap = [(r.title, r.tags, r.last_made) for r in s.scalars(select(m.Recipe).order_by(m.Recipe.id))]
    rep = run(database)
    assert counts(database) == first
    with database.session() as s:
        assert snap == [(r.title, r.tags, r.last_made) for r in s.scalars(select(m.Recipe).order_by(m.Recipe.id))]
    assert rep.recipes_created == 0 and rep.recipes_updated > 0
    assert rep.staples_created == 0 and rep.weeks_created == 0


def test_dry_run_writes_nothing(database):
    rep = run(database, rollback=True)
    assert rep.recipes_created > 0
    assert set(counts(database).values()) == {0}


def test_cli_dry_run(db_path, capsys):
    assert imp.main(["--dry-run", "--db", str(db_path), "--fixtures", str(FIX), "--menus", str(MENUS)]) == 0
    out = capsys.readouterr().out
    assert "DRY RUN" in out and "Recipes:" in out
    with Database(Settings(_env_file=None, cafe_db_path=db_path)).session() as s:
        assert s.scalar(select(func.count()).select_from(m.Recipe)) == 0


def test_bad_input_is_reported_not_fatal(database, tmp_path):
    rep = run(database)
    reasons = " | ".join(f"{w}: {r}" for w, r in rep.unparsed)
    assert "no title" in reasons  # untitled page
    assert "no ingredients" in reasons and "no steps" in reasons  # Basil shrimp / soup bodies

    bad = tmp_path / "fx"
    shutil.copytree(FIX, bad, ignore=shutil.ignore_patterns("menus"))
    (bad / "database_query.json").write_text(json.dumps({"results": [
        {"id": "x1", "properties": {"Title": {"title": [{"plain_text": "Weird"}]}, "Stars": {"type": "select", "select": {"name": "great"}}}},
        {"id": "x2", "properties": None},
    ]}))
    menus = tmp_path / "menus" / "archive" / "2026-04-06"
    menus.mkdir(parents=True)
    (menus / "menu.md").write_text("# Weekly Menu\n\n| Day | Meal |\n| **Monday (Feb 31)** | **X** |\nnot a table\n")
    d2 = Database(Settings(_env_file=None, cafe_db_path=tmp_path / "bad.db"))
    run_migrations(tmp_path / "bad.db")
    rep = run(d2, menus=tmp_path / "menus", fixtures=bad)
    d2.dispose()
    reasons = " | ".join(f"{w}: {r}" for w, r in rep.unparsed)
    assert "stars value not recognised" in reasons
    assert "invalid date" in reasons or "no schedule table rows" in reasons


def test_match_recipe_fuzzy():
    r = m.Recipe(title="Taco Tuesday")
    pool = {"taco tuesday": r}
    assert imp.match_recipe("Taco Tuesday (al pastor pork)", pool) is r
    assert imp.match_recipe("Taco Tuesdays", pool) is r
    assert imp.match_recipe("Lasagna", pool) is None
