import pytest

from cafe.seed_demo import MEALS, PANTRY, STAPLES
from cafe.services.grocery import (
    SECTION_KEYS,
    SECTIONS,
    add_qty,
    item_key,
    parse_free_text,
    section_of,
)


def test_six_sections_in_claude_md_order():
    assert [s["name"] for s in SECTIONS] == [
        "Produce",
        "Frozen",
        "Meat / Deli / Bakery",
        "Dry Goods / Canned / Condiments / Pasta / Rice / Spices",
        "Dairy / Eggs",
        "Beverages",
    ]


@pytest.mark.parametrize("a,b,expected", [
    ("2 lbs", "1 lb", "3 lbs"),
    ("1 lb", "1 lb", "2 lbs"),
    ("1.5 lbs", "1 lb", "2.5 lbs"),
    ("1 can", "1 can", "2 cans"),
    ("1 bunch", "1 bunch", "2 bunches"),
    ("2", "3", "5"),
    ("1/2 cup", "1 cup", "1.5 cups"),
    ("6 oz", "4 oz", "10 oz"),
])
def test_same_unit_sums(a, b, expected):
    assert add_qty(a, b) == expected


@pytest.mark.parametrize("a,b,expected", [
    ("2 lbs", "1 bag", "2 lbs + 1 bag"),
    ("3 cloves", "1 head", "3 cloves + 1 head"),
    ("2 lbs + 1 bag", "1 lb", "3 lbs + 1 bag"),
    ("a handful", "2 cups", "a handful + 2 cups"),
])
def test_mixed_units_join(a, b, expected):
    assert add_qty(a, b) == expected


def test_empty_qty_is_ignored():
    assert add_qty(None, "2 lbs") == "2 lbs"
    assert add_qty("", "") == ""


@pytest.mark.parametrize("text,qty,name,section", [
    ("2 lbs apples", "2 lbs", "apples", "produce"),
    ("Soda water", None, "Soda water", "beverages"),
    ("a dozen eggs", "1 dozen", "eggs", "dairy"),
    ("3 avocados", "3", "avocados", "produce"),
    ("1 gallon milk", "1 gallon", "milk", "dairy"),
    ("milk x2", "2", "milk", "dairy"),
    ("2 cans tomatoes", "2 cans", "tomatoes", "dry"),
    ("frozen fruit", None, "frozen fruit", "frozen"),
    ("1½ lbs ground beef", "1½ lbs", "ground beef", "meat"),
    ("1 1/2 cups rice", "1 1/2 cups", "rice", "dry"),
    ("2lbs green beans", "2 lbs", "green beans", "produce"),
    ("tortilla chips", None, "tortilla chips", "dry"),
    ("7up", None, "7up", "dry"),
    ("1 bag of salad greens", "1 bag", "salad greens", "produce"),
])
def test_free_text_parsing(text, qty, name, section):
    p = parse_free_text(text)
    assert (p.qty, p.name, p.section) == (qty, name, section)


@pytest.mark.parametrize("name,section", [
    ("Bananas", "produce"), ("Eggs", "dairy"), ("Milk", "dairy"), ("Bread", "meat"),
    ("Frozen fruit", "frozen"), ("Soda water", "beverages"), ("Yogurt", "dairy"), ("Cornstarch", "dry"),
    ("marinated pork taco meat", "meat"), ("small tortillas", "meat"), ("queso fresco 10 oz", "dairy"),
    ("fire-roasted tomatoes", "dry"), ("chicken broth", "dry"), ("peanut butter", "dry"),
    ("deli cheese", "meat"), ("coconut milk", "dry"), ("orange juice", "beverages"),
    ("Cream of chicken soup", "dry"), ("XL shrimp 16/20", "meat"), ("smoked paprika", "dry"),
    ("fresh basil", "produce"), ("Ice cream", "frozen"), ("paper towels", "dry"), ("eggplant", "produce"),
])
def test_section_of(name, section):
    assert section_of(name) == section


def test_every_known_name_files_into_one_of_six():
    names = [i[1] for d in MEALS.values() for i in d["ings"]] + list(STAPLES) + [p[1] for p in PANTRY]
    names += ["", "???", "zzz unknown thing", "Grandma's special", "kombucha", "dish soap"]
    for n in names:
        assert section_of(n) in SECTION_KEYS


def test_item_keys_are_stable():
    assert item_key("Lemons") == item_key("lemon") == "lemon"
    assert item_key("Yukon gold potatoes") == item_key("yukon gold potato")
    assert item_key("  Green   Beans ") == "green bean"
    assert item_key("Eggs") == "egg"
