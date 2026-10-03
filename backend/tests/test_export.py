from __future__ import annotations

import io
import json
import sqlite3
import zipfile

SECTION_HEADINGS = ["Produce", "Frozen", "Meat / Deli / Bakery",
                    "Dry Goods / Canned / Condiments / Pasta / Rice / Spices", "Dairy / Eggs", "Beverages"]


def test_all_json(client, seeded):
    r = client.get("/api/export/all.json")
    assert r.status_code == 200
    assert "cafe-lauren-" in r.headers["content-disposition"] and ".json" in r.headers["content-disposition"]
    data = json.loads(r.content)
    assert data["schema_version"] == 1
    for t in ("recipes", "weeks", "slots", "people", "stores", "settings", "staples", "jobs"):
        assert t in data["tables"]
    assert data["tables"]["recipes"] and data["tables"]["people"]


def test_recipes_zip(client, seeded):
    r = client.get("/api/export/recipes.zip")
    assert r.status_code == 200 and r.headers["content-type"] == "application/zip"
    assert ".zip" in r.headers["content-disposition"]
    z = zipfile.ZipFile(io.BytesIO(r.content))
    names = z.namelist()
    assert names and all(n.endswith(".md") and n == n.lower() and " " not in n for n in names)
    full = 0
    for n in names:
        md = z.read(n).decode()
        assert md.startswith("## ") and "### Ingredients" in md and "### Instructions" in md
        assert "### Leftover Ideas" in md and "**Serves:** 5 (+ leftovers)" in md
        if "- [ ] " in md:
            full += 1
    assert full == len(names)
    assert any("**" in z.read(n).decode().split("### Instructions")[1] for n in names)


def test_database_copy(client, seeded):
    r = client.get("/api/export/database")
    assert r.status_code == 200 and r.headers["content-type"] == "application/octet-stream"
    assert ".db" in r.headers["content-disposition"]
    p = client.app.state.settings.cafe_media_dir.parent / "copy.db"
    p.write_bytes(r.content)
    con = sqlite3.connect(p)
    try:
        assert con.execute("select count(*) from recipes").fetchone()[0] > 0
    finally:
        con.close()


def test_week_markdown(client, seeded):
    items = client.get(f"/api/weeks/{seeded}/list").json()
    keys_present = {s["key"] for s in items["sections"] if s["items"]}
    for text in ("2 bottles sparkling water", "1 bag frozen peas"):
        client.post(f"/api/weeks/{seeded}/list/items", json={"text": text})
    r = client.get(f"/api/export/weeks/{seeded}.md")
    assert r.status_code == 200 and seeded in r.headers["content-disposition"]
    md = r.text
    assert "## Menu" in md and "**Monday:**" in md and "## Grocery List" in md and "☐" in md
    got = client.get(f"/api/weeks/{seeded}/list").json()
    for sec in got["sections"]:
        if sec["items"]:
            assert f"### {sec['name']}" in md
    present = {s["key"] for s in got["sections"] if s["items"]}
    assert len(present) == 6
    assert all(f"### {h}" in md for h in SECTION_HEADINGS)
    assert keys_present <= present
