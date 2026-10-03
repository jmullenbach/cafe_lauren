from cafe.services.grocery import SECTION_KEYS

from .conftest import H, recipe_id, slot


def items(lst):
    return [i for s in lst["sections"] for i in s["items"]]


def find(lst, name):
    return next(i for i in items(lst) if i["name"].lower() == name.lower())


def get_list(client, monday):
    return client.get(f"/api/weeks/{monday}/list").json()


def test_sections_are_the_six_in_order_and_every_item_is_in_one(client, seeded):
    lst = get_list(client, seeded)
    assert [s["key"] for s in lst["sections"]] == SECTION_KEYS
    assert lst["sections"][3]["name"] == "Dry Goods / Canned / Condiments / Pasta / Rice / Spices"
    for sec in lst["sections"]:
        for it in sec["items"]:
            assert it["section"] == sec["key"]
    assert lst["total"] == len(items(lst)) > 20
    # quick adds of odd things still land in one of the six
    for text in ["dish soap", "2 lbs apples", "mystery item", "1 bottle wine", "frozen pizza"]:
        lst = client.post(f"/api/weeks/{seeded}/list/items", json={"text": text}).json()
    assert all(i["section"] in SECTION_KEYS for i in items(lst))
    assert not any(s["name"].lower().startswith("other") for s in lst["sections"])


def test_derived_from_cook_slots_minus_have_plus_staples(client, seeded):
    lst = get_list(client, seeded)
    names = {i["name"].lower() for i in items(lst)}
    assert "marinated pork taco meat" in names
    assert "smoked paprika" not in names and "olive oil" not in names  # flagged have
    assert {"bananas", "eggs", "milk", "bread", "soda water", "yogurt", "cornstarch"} <= names
    corn = find(lst, "sweet corn")
    assert corn["sale"] == "3/$1" and corn["note"] == "Tacos"
    assert find(lst, "Soda water")["staple"] and find(lst, "Soda water")["from"] == "joe"


def test_same_unit_summed_across_meals(client, seeded):
    gb = find(get_list(client, seeded), "green beans")
    assert gb["qty"] == "2 lbs"
    assert gb["note"] == "Pork chops + Citrus chicken"
    assert [s["day"] for s in gb["sources"]] == ["wed", "sat"]


def test_mixed_units_joined(client, seeded, state):
    sat = slot(state()["week"], "sat")
    ings = [{"qty": "1", "unit": "bag", "name": "green beans"}]
    client.patch(f"/api/slots/{sat['id']}", json={"ingredients": ings})
    assert find(get_list(client, seeded), "green beans")["qty"] == "1 lb + 1 bag"


def test_staple_hidden_when_confirmed_in_pantry(client, seeded):
    client.post("/api/pantry/items", json={"area": "Fridge", "name": "Whole milk", "qty": "1 gallon"})
    names = {i["name"] for i in items(get_list(client, seeded))}
    assert "Milk" not in names and "Eggs" in names


def test_have_flag_removes_ingredient(client, seeded, state):
    mon = slot(state()["week"], "mon")
    flags = dict(mon["ingredient_flags"])
    flags["lettuce"] = {"have": True}
    client.patch(f"/api/slots/{mon['id']}", json={"ingredient_flags": flags})
    assert "lettuce" not in {i["name"] for i in items(get_list(client, seeded))}


def test_quick_add_parse_edit_remove(client, seeded):
    lst = client.post(f"/api/weeks/{seeded}/list/items", json={"text": "2 lbs apples"}, headers=H("leidy")).json()
    apples = find(lst, "apples")
    assert apples["qty"] == "2 lbs" and apples["section"] == "produce" and apples["added"]
    assert apples["key"].startswith("add-") and apples["from"] == "leidy"
    lst = client.post(f"/api/weeks/{seeded}/list/items", json={"text": "paper towels", "section": "dry"}).json()
    assert find(lst, "paper towels")["section"] == "dry"
    lst = client.patch(f"/api/weeks/{seeded}/list/items/{apples['key']}", json={"qty": "3 lbs", "note": "Honeycrisp"}).json()
    assert find(lst, "apples")["qty"] == "3 lbs" and find(lst, "apples")["note"] == "Honeycrisp"
    lst = client.delete(f"/api/weeks/{seeded}/list/items/{apples['key']}").json()
    assert "apples" not in {i["name"] for i in items(lst)}


def test_edit_and_remove_derived_item(client, seeded):
    lst = client.patch(f"/api/weeks/{seeded}/list/items/green bean",
                       json={"qty": "3 lbs", "name": "haricots verts", "section": "frozen"}).json()
    it = next(i for i in items(lst) if i["key"] == "green bean")
    assert it["qty"] == "3 lbs" and it["name"] == "haricots verts" and it["edited"] and it["section"] == "frozen"
    lst = client.delete(f"/api/weeks/{seeded}/list/items/green bean").json()
    assert all(i["key"] != "green bean" for i in items(lst))
    assert client.patch(f"/api/weeks/{seeded}/list/items/nope", json={"qty": "1"}).status_code == 404


def test_check_toggle(client, seeded):
    lst = client.post(f"/api/weeks/{seeded}/list/items/egg/check", json={}, headers=H("lauren")).json()
    eggs = find(lst, "Eggs")
    assert eggs["checked"] and eggs["checked_by"] == "lauren"
    assert lst["unchecked"] == lst["total"] - 1
    lst = client.post(f"/api/weeks/{seeded}/list/items/egg/check", json={}).json()
    assert not find(lst, "Eggs")["checked"]
    lst = client.post(f"/api/weeks/{seeded}/list/items/egg/check", json={"checked": True}).json()
    lst = client.post(f"/api/weeks/{seeded}/list/items/egg/check", json={"checked": True}).json()
    assert find(lst, "Eggs")["checked"]


def test_diff_after_approval_and_confirm(client, seeded, state):
    assert get_list(client, seeded)["diff"] == []
    client.post(f"/api/weeks/{seeded}/approve")
    assert get_list(client, seeded)["diff"] == []
    # own quick adds are not plan changes
    client.post(f"/api/weeks/{seeded}/list/items", json={"text": "2 lbs apples"})
    assert get_list(client, seeded)["diff"] == []
    # swap Saturday's citrus chicken for the salmon
    salmon = recipe_id(client, "Sheet Pan Salmon with Lemon Potatoes")
    sat = slot(state()["week"], "sat")
    client.post(f"/api/slots/{sat['id']}/swap", json={"kind": "recipe", "recipe_id": salmon})
    lst = get_list(client, seeded)
    d = {(x["change"], x["key"]): x for x in lst["diff"]}
    assert ("added", "atlantic salmon fillet") in d
    assert ("removed", "boneless chicken thigh") in d
    assert ("removed", "navel orange") in d
    lemon = d[("changed", "lemon")]
    assert lemon["previous_qty"] == "2" and lemon["qty"] == "4"
    assert ("changed", "yukon gold potato") in d
    assert ("changed", "green bean") not in d  # 1 lb + 1 lb either way
    assert client.get("/api/state").json()["list"]["diff_count"] == len(lst["diff"])
    lst = client.post(f"/api/weeks/{seeded}/list/confirm-diff").json()
    assert lst["diff"] == []
    assert client.get("/api/state").json()["week"]["list_diff_count"] == 0


def test_confirm_diff_requires_approval(client, seeded):
    assert client.post(f"/api/weeks/{seeded}/list/confirm-diff").status_code == 409


def test_text_export(client, seeded):
    client.post(f"/api/weeks/{seeded}/list/items/egg/check", json={"checked": True})
    r = client.get(f"/api/weeks/{seeded}/list/text")
    assert r.headers["content-type"].startswith("text/plain")
    t = r.text
    assert t.startswith("Grocery list · Week of ")
    assert "☐ 2 lbs green beans" in t and "☐ Bananas" in t
    assert "☐ Eggs" not in t
    assert t.index("Produce") < t.index("Frozen") < t.index("Meat / Deli / Bakery") < t.index("Dairy / Eggs")
    t2 = client.get(f"/api/weeks/{seeded}/list/text", params={"include_checked": True}).text
    assert "☑ Eggs" in t2
