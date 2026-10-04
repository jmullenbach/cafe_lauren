# Weekly Menu Planner

Run the full weekly meal planning workflow. Follow each step in order, pausing for user input where noted.

**Prerequisites:** Run `/setup` first to configure your `.env` with Notion credentials and grocery store. All IDs referenced below come from `.env`.

## Tooling

Use the Python helper scripts for all Notion operations — they handle pagination, archived block restoration, and batching automatically:

- **`scripts/notion_helpers.py`** — All Notion API operations (search meals, get staples, grocery status, clear checked items, push grocery list, tag meals, clear week tags)
- **`scripts/fetch_ads.py`** — Download grocery store weekly ad images

Run them with `.venv/bin/python scripts/<script>.py <command>`. See docstrings for full usage.

**Important `.env` note:** When running inline Python or shell commands that need env vars, use `export $(cat .env | xargs)` — do NOT use `source .env` as it doesn't work reliably.

## Step 1: Archive Last Week & Gather Info

Run these in parallel to save time:

1. **Archive previous week:** Check if `data/current_week/` has files from a previous week. If so, create a dated folder in `data/archive/` (use the Monday date of the previous week, format `YYYY-MM-DD`) and move all files there.

2. **Check grocery list status:** Run `.venv/bin/python scripts/notion_helpers.py get-grocery-status` to see checked/unchecked items in both "To Buy" and "Staples" sections.
   - If there are **unchecked items**, notify the user and ask whether to keep or remove them before proceeding.
   - If keeping unchecked items, they must be incorporated into the correct store section of the new grocery list later.

3. **List last week's tagged meals:** Run `.venv/bin/python scripts/notion_helpers.py list-tagged` to see what was planned last week.

4. **Download & analyze grocery store ads:** Run `.venv/bin/python scripts/fetch_ads.py`, then read each downloaded image in `images/ads/` using the Read tool (vision). Extract: item name, sale price, unit, and category. Save deals to `data/current_week/deals.md`.

5. **Inventory pantry:** Check `/Users/mojo/Joe Drive/_pantry/` FIRST (synced from Google Photos via Google Drive — this is the primary, freshest source). Fall back to `images/pantry/` only if the Drive folder is empty or missing. Read each photo with the Read tool. Identify all visible items and estimate quantities. Save to `data/current_week/pantry_inventory.md`.

6. **Fetch staples list:** Run `.venv/bin/python scripts/notion_helpers.py get-staples` to get the current staples.

Present the user with: last week's meals, current deals (highlighting relevant ones), pantry inventory, and ask what they want this week.

## Step 2: Generate Weekly Menu

Combine all inputs (user preferences, deals, pantry inventory) with these constraints:

**Meal constraints:**
- **4-5 cook-fresh meals** (family eats leftovers 2-3 days per week) — but the user may specify fewer
- 5 people per meal
- Large vegetable portions or sides with every meal
- A protein in every meal
- Fast, simple cooking methods: sheet pan, instant pot, Le Creuset, skillet
- Favorite proteins: boneless chicken thighs, pork, premixed taco meats, sausages
- Prioritize items on sale at the grocery store and pantry items that need using up
- **Leidy's meals:** Leidy cooks 1-2 meals/week for the whole family. Ask the user what Leidy is cooking, include in the schedule, and add all Leidy ingredients to the shared grocery list.

**For each meal, provide:**
- Title and 1-sentence description
- Cooking method (sheet pan / instant pot / Le Creuset / skillet)
- Total cooking time
- Healthiness rating (0-10)
- Deliciousness rating (0-10)
- Approximate cost for 5 people
- Leftover potential: how many days of leftovers, and suggested leftover variations

Present the full week plan (cook days + leftover days) as a formatted table. Wait for user feedback. Adjust specific meals as requested. Save the approved menu to `data/current_week/menu.md`.

## Step 3: Search for Meals in Database

For each approved meal, search the Menu database:
```
.venv/bin/python scripts/notion_helpers.py search-meals <term1> <term2> ...
```

This returns the Notion page ID, ingredients, stars, and current tag for each match. You'll need the page IDs for tagging, and the ingredients for the grocery list.

If a meal is NOT in the database, generate a full recipe (see Step 4) and offer to add it with `/add-recipe`.

## Step 4: Generate Recipes (if needed)

Only generate recipes for meals that are NOT already in the Notion database. Use the standard format from CLAUDE.md:
- Checkbox format for ingredients and steps
- Bold quantities inline in instruction steps
- Steps grouped under descriptive headings
- Portions for 5 adults, extra for leftover meals

Save any new recipes to `data/current_week/recipes.md`.

## Step 5: Generate Grocery List

1. Extract every ingredient from every meal (from Notion DB results or newly generated recipes).
2. Check against `data/current_week/pantry_inventory.md` — subtract items already on hand.
3. Combine duplicate ingredients across recipes (sum quantities).
4. **Staples check:** Compare the staples list (from Step 1) against the pantry inventory. Any staple not confirmed on hand goes on the grocery list under the appropriate store section.
5. If there were unchecked items the user wanted to keep (from Step 1), incorporate them into the correct store section.

**Organize by these 6 store sections only** (matches the store layout per CLAUDE.md):
1. Produce
2. Frozen
3. Meat / Deli / Bakery
4. Dry Goods / Canned / Condiments / Pasta / Rice / Spices
5. Dairy / Eggs
6. Beverages

Never use a catch-all like "Other / Household." Flag items that are on sale at the grocery store.

**Verification step:** Cross-reference every single ingredient in every recipe AND every staple item against the grocery list + pantry inventory. Print any discrepancies found and add missing items.

Present the list to the user for approval. Save to `data/current_week/grocery_list.md`.

## Step 6: Push to Notion

### 6a. Clear old grocery items
```
.venv/bin/python scripts/notion_helpers.py clear-checked
```
This only deletes **checked** (completed) items. Never deletes unchecked items.

**Important:** This also automatically restores blocks that Notion archives when all children are deleted — a known Notion API quirk.

### 6b. Clear last week's meal tags
```
.venv/bin/python scripts/notion_helpers.py clear-week-tags
```

### 6c. Push the grocery list

Create a JSON file at `data/current_week/grocery_notion.json` with this structure:
```json
{
  "to_buy": [
    {
      "section": "🥬 Produce",
      "items": [
        {"text": "2 lbs red potatoes — parm chicken — ON SALE $0.99/lb", "bold_prefix": "2 lbs"},
        {"text": "avocados — tortilla soup + tacos"}
      ]
    },
    {
      "section": "🧊 Frozen",
      "items": [...]
    },
    {
      "section": "🥩 Meat / Deli / Bakery",
      "items": [...]
    },
    {
      "section": "🥫 Dry Goods / Canned / Condiments",
      "items": [...]
    },
    {
      "section": "🧀 Dairy / Eggs",
      "items": [...]
    },
    {
      "section": "🥤 Beverages",
      "items": [...]
    }
  ],
  "staples": [
    "Bananas",
    "Eggs — ON SALE $0.99/doz",
    "..."
  ]
}
```

Then push:
```
.venv/bin/python scripts/notion_helpers.py push-grocery data/current_week/grocery_notion.json
```

### 6d. Tag this week's meals

Create a JSON file at `data/current_week/meal_tags.json`:
```json
[
  {"page_id": "abc123...", "tag": "1. Monday"},
  {"page_id": "def456...", "tag": "3. Wednesday"}
]
```

Then tag:
```
.venv/bin/python scripts/notion_helpers.py tag-meals data/current_week/meal_tags.json
```

### 6e. Confirm
- Print a summary: number of grocery items added, number of menu entries tagged
- Construct the Notion page link from `$NOTION_GROCERY_PAGE_ID` and provide it to the user
