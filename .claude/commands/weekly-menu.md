# Weekly Menu Planner

Run the full weekly meal planning workflow. Follow each step in order, pausing for user input where noted.

**Prerequisites:** Run `/setup` first to configure your `.env` with Notion credentials and grocery store. All IDs referenced below come from `.env`.

## Step 1: Archive Last Week & Pull Favorites

1. Check if `data/current_week/` has files from a previous week.
2. If so, create a dated folder in `data/archive/` (use the Monday date of the previous week, format `YYYY-MM-DD`) and move all files there.
3. Read `.env` to get all Notion IDs. Query the Notion Menu database (`$NOTION_MENU_DB_ID`) via the API:
   - Find entries tagged "0. This Week" or any day tags (1. Monday through 7. Sunday) — these were last week's meals
   - Find entries with Stars >= 4 — these are proven favorites
4. Read the "To Buy:" section of the Grocery List page (`$NOTION_GROCERY_PAGE_ID`) to see any checked-off items
5. Save findings to `data/current_week/favorites.md`.
6. Ask the user: "Here are last week's meals and your all-time favorites. Which ones do you want in rotation this week?"

## Step 2: Download & Analyze Grocery Store Ads

1. Run: `.venv/bin/python scripts/fetch_ads.py`
2. Read each downloaded image in `images/ads/` using the Read tool (vision).
3. For each ad page, extract: item name, sale price, unit (per lb / each / per pack), and category (produce, meat, dairy, etc.).
4. Save the deals to `data/current_week/deals.md` in a structured table.
5. Highlight deals that match preferred proteins (chicken thighs, pork, taco meat, sausages) and commonly used vegetables.

## Step 3: Inventory Pantry/Freezer/Produce

1. Check `images/pantry/`, `images/freezer/`, and `images/produce/` for photos.
2. If no photos are found, ask the user to drop photos into these folders or paste them directly.
3. Read each photo with the Read tool. Identify all visible items and estimate quantities.
4. Compile into `data/current_week/pantry_inventory.md` organized by category.
5. Present the inventory and ask the user to correct anything.

## Step 4: Generate Weekly Menu (Leftover-Aware)

Combine all inputs (favorites, deals, pantry inventory) with these constraints:

**Meal constraints:**
- **4-5 cook-fresh meals** (not 7 — the family eats leftovers 2-3 days per week)
- 5 people per meal
- Large vegetable portions or sides with every meal
- A protein in every meal
- Fast, simple cooking methods: sheet pan, instant pot, Le Creuset
- Favorite proteins: boneless chicken thighs, pork, premixed taco meats, sausages
- Prioritize items on sale at the grocery store and pantry items that need using up

**For each meal, provide:**
- Title and 1-sentence description
- Cooking method (sheet pan / instant pot / Le Creuset / skillet)
- Total cooking time
- Healthiness rating (0-10)
- Deliciousness rating (0-10)
- Approximate cost for 5 people
- Leftover potential: how many days of leftovers, and suggested leftover variations

**Leftover planning:**
- Mark meals that make great leftovers and suggest which days to eat them
- Size portions accordingly (bigger batches for leftover meals)
- Suggest how to repurpose leftovers (e.g., "Day 2: shred pork for tacos")

Present the full week plan (cook days + leftover days) as a formatted table. Wait for user feedback. Adjust specific meals as requested. Save the approved menu to `data/current_week/menu.md`.

## Step 5: Generate Full Recipes

For each approved cook-fresh meal, generate a detailed recipe in this exact format:

```
## [Meal Title]
*[1-sentence description]*
**Prep time:** X min | **Cook time:** X min | **Total:** X min
**Serves:** 5 (+ leftovers) | **Healthiness:** X/10 | **Deliciousness:** X/10 | **Cost:** ~$X

### Ingredients
- [ ] [quantity] [ingredient]
- [ ] [quantity] [ingredient]
...

### Instructions

[Step Group Name]:
- [ ] [Action with **bold quantity + ingredient** inline]
- [ ] [Next action with **bold quantity + ingredient** inline]

[Next Step Group Name]:
- [ ] [Action with **bold quantity + ingredient** inline]
...

### Leftover Ideas
- Day 2: [how to repurpose leftovers]
```

**Critical formatting rules:**
- Every ingredient amount must appear **bold** inline in the instruction step where it's used
- Use checkbox format (`- [ ]`) for both ingredients and steps
- Group steps under descriptive headings (e.g., "Prep the Vegetables:", "Cook the Protein:")
- Portions for 5 adults, with extra for meals marked as leftover-generators

Save all recipes to `data/current_week/recipes.md`.

## Step 6: Generate Grocery List

1. Extract every ingredient from every recipe, accounting for larger portions on leftover meals.
2. Check against `data/current_week/pantry_inventory.md` — subtract items already on hand.
3. Combine duplicate ingredients across recipes (sum the quantities).
4. **Staples check:** Query the "Staples" entry in the Notion Menu database (`$NOTION_STAPLES_PAGE_ID`) and read its Ingredients field. For each staple item, check whether it's already in the pantry inventory. Any staple not confirmed on hand must be added to the grocery list under the appropriate store section.
5. Organize by grocery store section with checkbox format:

```
## Produce
- [ ] [Item] ([quantity]) — ON SALE $X.XX/lb (if applicable)

## Meat / Seafood
- [ ] [Item] ([quantity])

## Dairy / Eggs
## Bakery
## Canned / Jarred Goods
## Dry Goods / Pasta / Rice
## Frozen
## Condiments / Sauces
## Spices / Seasonings
## Beverages
## Other / Household
```

6. **Verification step:** Cross-reference every single ingredient in every recipe AND every staple item against the grocery list + pantry inventory. Print any discrepancies found and add missing items.
7. Save to `data/current_week/grocery_list.md`.

## Step 7: Push to Notion

Read `.env` for the Notion API token and all IDs. Reference `data/notion_structure.md` for block structure.

### 7a. Update the Grocery List
1. Delete existing `to_do` blocks in the "To Buy:" section (between the `$NOTION_TO_BUY_BLOCK_ID` paragraph and `$NOTION_STAPLES_BLOCK_ID` paragraph)
2. Append new `to_do` blocks for this week's grocery items, organized by store section
3. Use rich text annotations: **bold** for quantities, regular text for item descriptions
4. Leave the "Staples:" section untouched (those are recurring items the user manages manually)
5. Batch appends if hitting the 100-block-per-request limit

### 7b. Tag This Week's Menu
This is just for reference so you can look back at what was planned:
1. Clear last week's day tags — query the Menu database for entries tagged "0. This Week" or any day (1. Monday through 7. Sunday) and remove their tags
2. For each approved meal:
   - If it already exists in the Menu database, update its **Tags** to the assigned day
   - If it's a new recipe, create a new entry with the Title and day tag
3. Confirm to the user which recipes were tagged

### 7c. Confirm
- Print a summary: number of grocery items added, number of menu entries tagged
- Construct the Notion page link from `$NOTION_GROCERY_PAGE_ID` and provide it to the user
