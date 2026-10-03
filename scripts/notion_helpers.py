#!/usr/bin/env python3
"""Notion API helpers for the Cafe Lauren weekly meal planner.

Provides reusable functions for common Notion operations:
- Querying the Menu database (search meals, get staples)
- Managing the grocery list (clear checked items, push new list)
- Tagging meals to days
- Clearing old week's tags

Run with: .venv/bin/python scripts/notion_helpers.py <command> [args]

Commands:
    search-meals <term1> [term2] ...   Search menu DB for meals by title
    get-staples                        Fetch staples list from the Staples entry
    get-grocery-status                 Show checked/unchecked items in To Buy and Staples
    clear-checked                      Delete checked to_do items from To Buy and Staples
    clear-all                          Delete ALL to_do items (only after user confirms)
    push-grocery <json_file>           Push grocery list from JSON file to Notion
    add-items <section> <item1> ...    Add items to "to_buy" or "staples" section
    tag-meals <json_file>              Tag meals to days from JSON file
    clear-week-tags                    Remove day tags from all currently tagged meals
    list-tagged                        List all meals currently tagged to a day
"""

import json
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

TOKEN = os.getenv("NOTION_API_TOKEN", "")
MENU_DB_ID = os.getenv("NOTION_MENU_DB_ID", "")
GROCERY_PAGE_ID = os.getenv("NOTION_GROCERY_PAGE_ID", "")
STAPLES_PAGE_ID = os.getenv("NOTION_STAPLES_PAGE_ID", "")
TO_BUY_BLOCK_ID = os.getenv("NOTION_TO_BUY_BLOCK_ID", "")
STAPLES_BLOCK_ID = os.getenv("NOTION_STAPLES_BLOCK_ID", "")

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

DAY_TAGS = [
    "0. This Week", "1. Monday", "2. Tuesday", "3. Wednesday",
    "4. Thursday", "5. Friday", "6. Saturday", "7. Sunday", "8. Spare",
]


def _api_get(url, **kwargs):
    resp = requests.get(url, headers=HEADERS, **kwargs)
    resp.raise_for_status()
    return resp.json()


def _api_post(url, payload):
    resp = requests.post(url, headers=HEADERS, json=payload)
    resp.raise_for_status()
    return resp.json()


def _api_patch(url, payload):
    resp = requests.patch(url, headers=HEADERS, json=payload)
    resp.raise_for_status()
    return resp.json()


def _api_delete(url):
    resp = requests.delete(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()


def _get_all_children(block_id):
    """Fetch all child blocks of a block, handling pagination."""
    children = []
    url = f"https://api.notion.com/v1/blocks/{block_id}/children?page_size=100"
    while url:
        data = _api_get(url)
        children.extend(data.get("results", []))
        if data.get("has_more"):
            cursor = data["next_cursor"]
            url = f"https://api.notion.com/v1/blocks/{block_id}/children?page_size=100&start_cursor={cursor}"
        else:
            url = None
    return children


def _ensure_block_not_archived(block_id):
    """Check if a block is archived and restore it if so.

    Notion archives a parent block when all its children are deleted.
    This restores it so we can append new children.
    """
    data = _api_get(f"https://api.notion.com/v1/blocks/{block_id}")
    if data.get("in_trash"):
        _api_patch(f"https://api.notion.com/v1/blocks/{block_id}", {"archived": False})
        return True
    return False


def _make_todo_block(text, bold_prefix=None):
    """Create a to_do block dict.

    Args:
        text: Full display text of the item.
        bold_prefix: If provided, this portion of text is bolded (for quantities).
    """
    if bold_prefix and text.startswith(bold_prefix):
        rest = text[len(bold_prefix):]
        rich_text = [
            {"type": "text", "text": {"content": bold_prefix}, "annotations": {"bold": True}},
            {"type": "text", "text": {"content": rest}},
        ]
    else:
        rich_text = [{"type": "text", "text": {"content": text}}]
    return {
        "object": "block",
        "type": "to_do",
        "to_do": {"rich_text": rich_text, "checked": False},
    }


def _make_section_header(text):
    """Create a bold+underline paragraph block for grocery section headers."""
    return {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{
                "type": "text",
                "text": {"content": text},
                "annotations": {"bold": True, "underline": True},
            }],
        },
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def search_meals(terms):
    """Search the Menu database for meals matching any of the given terms.

    Returns a list of dicts with: id, title, stars, tag, ingredients.
    """
    filters = [{"property": "Title", "title": {"contains": t}} for t in terms]
    payload = {"filter": {"or": filters}} if len(filters) > 1 else {"filter": filters[0]}

    data = _api_post(f"https://api.notion.com/v1/databases/{MENU_DB_ID}/query", payload)
    results = []
    for page in data.get("results", []):
        props = page["properties"]
        title_parts = props.get("Title", {}).get("title", [])
        title = "".join(t["plain_text"] for t in title_parts)
        ingredients = "".join(t["plain_text"] for t in props.get("Ingredients", {}).get("rich_text", []))
        tag_obj = props.get("Tags", {}).get("select")
        results.append({
            "id": page["id"],
            "title": title,
            "stars": props.get("Stars", {}).get("number"),
            "tag": tag_obj["name"] if tag_obj else None,
            "ingredients": ingredients,
        })
    return results


def get_staples():
    """Fetch the staples list from the Staples entry in the Menu database.

    Returns a list of staple item strings.
    """
    data = _api_get(f"https://api.notion.com/v1/pages/{STAPLES_PAGE_ID}")
    ingredients = data.get("properties", {}).get("Ingredients", {}).get("rich_text", [])
    text = "".join(t["plain_text"] for t in ingredients)
    items = []
    for line in text.split("\n"):
        line = line.strip()
        # Strip bullet and checkbox markers
        for prefix in ("• [ ] ", "• [x] ", "- [ ] ", "- [x] ", "• ", "- "):
            if line.startswith(prefix):
                line = line[len(prefix):]
                break
        line = line.strip()
        if line and not line.endswith(":"):
            items.append(line)
    return items


def get_grocery_status():
    """Get checked/unchecked to_do items from both To Buy and Staples sections.

    Returns dict with keys: to_buy_checked, to_buy_unchecked, staples_checked, staples_unchecked.
    Each is a list of dicts with 'id' and 'text'.
    """
    result = {
        "to_buy_checked": [], "to_buy_unchecked": [],
        "staples_checked": [], "staples_unchecked": [],
    }

    for section, block_id in [("to_buy", TO_BUY_BLOCK_ID), ("staples", STAPLES_BLOCK_ID)]:
        try:
            children = _get_all_children(block_id)
        except requests.HTTPError:
            continue
        for block in children:
            if block["type"] == "to_do":
                text = "".join(t["plain_text"] for t in block["to_do"]["rich_text"])
                entry = {"id": block["id"], "text": text}
                if block["to_do"]["checked"]:
                    result[f"{section}_checked"].append(entry)
                else:
                    result[f"{section}_unchecked"].append(entry)
    return result


def clear_checked():
    """Delete all checked to_do items from To Buy and Staples sections.

    Returns count of deleted items per section.
    """
    counts = {"to_buy": 0, "staples": 0}

    for section, block_id in [("to_buy", TO_BUY_BLOCK_ID), ("staples", STAPLES_BLOCK_ID)]:
        try:
            children = _get_all_children(block_id)
        except requests.HTTPError:
            continue
        for block in children:
            if block["type"] == "to_do" and block["to_do"]["checked"]:
                try:
                    _api_delete(f"https://api.notion.com/v1/blocks/{block['id']}")
                    counts[section] += 1
                except requests.HTTPError:
                    pass

    # Restore blocks if they got archived from having all children deleted
    for block_id in [TO_BUY_BLOCK_ID, STAPLES_BLOCK_ID]:
        _ensure_block_not_archived(block_id)

    return counts


def clear_all():
    """Delete ALL to_do items (checked and unchecked) from To Buy and Staples.

    Only use after the user has explicitly confirmed unchecked items may go.
    """
    counts = {"to_buy": 0, "staples": 0}
    for section, block_id in [("to_buy", TO_BUY_BLOCK_ID), ("staples", STAPLES_BLOCK_ID)]:
        try:
            children = _get_all_children(block_id)
        except requests.HTTPError:
            continue
        for block in children:
            if block["type"] == "to_do":
                try:
                    _api_delete(f"https://api.notion.com/v1/blocks/{block['id']}")
                    counts[section] += 1
                except requests.HTTPError:
                    pass
    for block_id in [TO_BUY_BLOCK_ID, STAPLES_BLOCK_ID]:
        _ensure_block_not_archived(block_id)
    return counts


def push_grocery_list(grocery_data):
    """Push a structured grocery list to the To Buy section in Notion.

    Args:
        grocery_data: dict with this structure:
            {
                "to_buy": [
                    {
                        "section": "🥬 Produce",
                        "items": [
                            {"text": "2 lbs red potatoes — parm chicken", "bold_prefix": "2 lbs"},
                            {"text": "avocados — tortilla soup"}
                        ]
                    },
                    ...
                ],
                "staples": [
                    "Bananas",
                    "Eggs — ON SALE $0.99/doz",
                    ...
                ]
            }

    Returns counts of blocks added per section.
    """
    # Ensure blocks are not archived before appending
    _ensure_block_not_archived(TO_BUY_BLOCK_ID)
    _ensure_block_not_archived(STAPLES_BLOCK_ID)

    # Build To Buy blocks
    to_buy_blocks = []
    for section in grocery_data.get("to_buy", []):
        to_buy_blocks.append(_make_section_header(section["section"]))
        for item in section["items"]:
            to_buy_blocks.append(_make_todo_block(item["text"], item.get("bold_prefix")))

    # Notion limit: 100 blocks per append. Batch if needed.
    to_buy_count = 0
    for i in range(0, len(to_buy_blocks), 100):
        batch = to_buy_blocks[i:i + 100]
        _api_patch(
            f"https://api.notion.com/v1/blocks/{TO_BUY_BLOCK_ID}/children",
            {"children": batch},
        )
        to_buy_count += len(batch)

    # Build and push Staples blocks
    staples_blocks = [_make_todo_block(item) for item in grocery_data.get("staples", [])]
    staples_count = 0
    if staples_blocks:
        # Clear existing staples first
        try:
            children = _get_all_children(STAPLES_BLOCK_ID)
            for block in children:
                if block["type"] == "to_do":
                    try:
                        _api_delete(f"https://api.notion.com/v1/blocks/{block['id']}")
                    except requests.HTTPError:
                        pass
            # Restore if archived
            _ensure_block_not_archived(STAPLES_BLOCK_ID)
        except requests.HTTPError:
            _ensure_block_not_archived(STAPLES_BLOCK_ID)

        for i in range(0, len(staples_blocks), 100):
            batch = staples_blocks[i:i + 100]
            _api_patch(
                f"https://api.notion.com/v1/blocks/{STAPLES_BLOCK_ID}/children",
                {"children": batch},
            )
            staples_count += len(batch)

    return {"to_buy_blocks": to_buy_count, "staples_blocks": staples_count}


def tag_meals(meal_tags):
    """Tag meals in the Menu database to specific days.

    Args:
        meal_tags: list of dicts with 'page_id' and 'tag' keys.
            Example: [{"page_id": "abc123", "tag": "1. Monday"}]

    Returns list of results with title and tag.
    """
    results = []
    for entry in meal_tags:
        data = _api_patch(
            f"https://api.notion.com/v1/pages/{entry['page_id']}",
            {"properties": {"Tags": {"select": {"name": entry["tag"]}}}},
        )
        title = "".join(t["plain_text"] for t in data["properties"]["Title"]["title"])
        results.append({"title": title, "tag": entry["tag"]})
    return results


def clear_week_tags():
    """Remove day tags from all currently tagged meals (reset for new week).

    Returns list of meal titles that were untagged.
    """
    # Query for all meals with any day tag
    filters = [{"property": "Tags", "select": {"equals": tag}} for tag in DAY_TAGS]
    data = _api_post(
        f"https://api.notion.com/v1/databases/{MENU_DB_ID}/query",
        {"filter": {"or": filters}},
    )

    cleared = []
    for page in data.get("results", []):
        title = "".join(t["plain_text"] for t in page["properties"]["Title"]["title"])
        _api_patch(
            f"https://api.notion.com/v1/pages/{page['id']}",
            {"properties": {"Tags": {"select": None}}},
        )
        cleared.append(title)
    return cleared


def list_tagged():
    """List all meals currently tagged to a day.

    Returns list of dicts with title, tag, stars, id.
    """
    filters = [{"property": "Tags", "select": {"equals": tag}} for tag in DAY_TAGS]
    data = _api_post(
        f"https://api.notion.com/v1/databases/{MENU_DB_ID}/query",
        {"filter": {"or": filters}},
    )

    results = []
    for page in data.get("results", []):
        props = page["properties"]
        title = "".join(t["plain_text"] for t in props["Title"]["title"])
        tag_obj = props.get("Tags", {}).get("select")
        results.append({
            "id": page["id"],
            "title": title,
            "tag": tag_obj["name"] if tag_obj else None,
            "stars": props.get("Stars", {}).get("number"),
        })
    return sorted(results, key=lambda x: x["tag"] or "")


def add_items(section: str, items: list[str]) -> int:
    """Append to_do items to either the To Buy or Staples section.

    Args:
        section: "to_buy" or "staples"
        items:   List of item text strings to add

    Returns:
        Number of items added.
    """
    block_id = TO_BUY_BLOCK_ID if section == "to_buy" else STAPLES_BLOCK_ID
    children = [_make_todo_block(item) for item in items]
    result = _api_patch(
        f"https://api.notion.com/v1/blocks/{block_id}/children",
        {"children": children},
    )
    return len(result.get("results", []))


# ---------------------------------------------------------------------------
# CLI interface
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "search-meals":
        if len(sys.argv) < 3:
            print("Usage: search-meals <term1> [term2] ...")
            sys.exit(1)
        results = search_meals(sys.argv[2:])
        for r in results:
            print(f"\n=== {r['title']} (Stars: {r['stars']}, Tag: {r['tag']}) ===")
            print(f"ID: {r['id']}")
            print(f"Ingredients:\n{r['ingredients']}")

    elif cmd == "get-staples":
        items = get_staples()
        for item in items:
            print(f"  - {item}")

    elif cmd == "get-grocery-status":
        status = get_grocery_status()
        print(f"To Buy — checked: {len(status['to_buy_checked'])}, unchecked: {len(status['to_buy_unchecked'])}")
        for item in status["to_buy_unchecked"]:
            print(f"  [ ] {item['text']}")
        print(f"\nStaples — checked: {len(status['staples_checked'])}, unchecked: {len(status['staples_unchecked'])}")
        for item in status["staples_unchecked"]:
            print(f"  [ ] {item['text']}")

    elif cmd == "clear-checked":
        counts = clear_checked()
        print(f"Deleted {counts['to_buy']} checked To Buy items, {counts['staples']} checked Staples items")

    elif cmd == "clear-all":
        counts = clear_all()
        print(f"Deleted {counts['to_buy']} To Buy items, {counts['staples']} Staples items (all)")

    elif cmd == "push-grocery":
        if len(sys.argv) < 3:
            print("Usage: push-grocery <json_file>")
            sys.exit(1)
        with open(sys.argv[2]) as f:
            data = json.load(f)
        counts = push_grocery_list(data)
        print(f"Added {counts['to_buy_blocks']} To Buy blocks, {counts['staples_blocks']} Staples blocks")

    elif cmd == "add-items":
        if len(sys.argv) < 4:
            print("Usage: add-items <to_buy|staples> <item1> [item2] ...")
            sys.exit(1)
        section = sys.argv[2]
        if section not in ("to_buy", "staples"):
            print("Section must be 'to_buy' or 'staples'")
            sys.exit(1)
        items_to_add = sys.argv[3:]
        count = add_items(section, items_to_add)
        print(f"Added {count} item(s) to {section}: {', '.join(items_to_add)}")

    elif cmd == "tag-meals":
        if len(sys.argv) < 3:
            print("Usage: tag-meals <json_file>")
            sys.exit(1)
        with open(sys.argv[2]) as f:
            data = json.load(f)
        results = tag_meals(data)
        for r in results:
            print(f"Tagged {r['title']} → {r['tag']}")

    elif cmd == "clear-week-tags":
        cleared = clear_week_tags()
        print(f"Cleared tags from {len(cleared)} meals: {', '.join(cleared)}")

    elif cmd == "list-tagged":
        tagged = list_tagged()
        for t in tagged:
            print(f"  {t['tag']}: {t['title']} (Stars: {t['stars']})")

    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
