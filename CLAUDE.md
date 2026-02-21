# Cafe Lauren — Weekly Meal Planning & Grocery List

A Claude Code project for weekly meal planning for a family of 5. Integrates with Notion for the grocery list/recipe database, a local grocery store for weekly deals, and phone photos for pantry inventory.

## Notion Integration

- **Grocery List page ID:** `$NOTION_GROCERY_PAGE_ID` (from `.env`)
- **Menu database ID:** `$NOTION_MENU_DB_ID` (from `.env`)
- **API:** Internal integration via Notion REST API (token in `.env`)
- **Page structure:** See `data/notion_structure.md` for full details

### Notion Page Layout
The Grocery List page has three sections:
1. **"To Buy:"** — recipe-specific ingredients as `to_do` blocks (bold quantities + description)
2. **"Staples:"** — recurring household items as `to_do` blocks (simple text, no quantities)
3. **Menu database** (inline) — recipes with properties: Title, Tags (day of week), Stars (rating), Ingredients (rich text)

### Staples Entry in Menu Database
The Menu database contains a special entry called **"Staples"** (page ID: `$NOTION_STAPLES_PAGE_ID` from `.env`) that lists recurring household items the family always needs. During grocery list generation, fetch this list live from Notion and cross-reference against the pantry inventory. Any staple not confirmed on hand must be added to the "To Buy" list.

### Menu Database Tags
Use these exact select values when assigning meals to days:
`0. This Week`, `1. Monday`, `2. Tuesday`, `3. Wednesday`, `4. Thursday`, `5. Friday`, `6. Saturday`, `7. Sunday`, `8. Spare`

### Existing 5-Star Favorites
- Lauren's Chili
- Instant Pot Chicken Tortilla Soup
- Taco Tuesday
- Basil Shrimp with Feta and Orzo

## Meal Constraints

- **4-5 cook-fresh meals per week** (family eats leftovers 2-3 days)
- **5 people** per meal
- Every meal includes a **protein** and **large vegetable portions/sides**
- **Cooking methods:** sheet pan, instant pot, Le Creuset, skillet — fast and simple for busy parents
- **Favorite proteins:** boneless chicken thighs, pork, premixed taco meats, sausages
- **Prioritize:** items on sale at the grocery store (`$GROCERY_STORE` in `.env`), pantry/freezer items that need using up
- **Leftover planning:** mark meals that make great leftovers, size portions bigger, suggest how to repurpose day 2+

## Each Meal Entry Includes

- Title + 1-sentence description
- Cooking method
- Total cooking time
- Healthiness rating (0-10)
- Deliciousness rating (0-10)
- Approximate cost for 5 people
- Leftover potential (days of leftovers + suggested variations)

## Recipe Format

Use this exact format for all recipes:

```
## [Meal Title]
*[1-sentence description]*
**Prep time:** X min | **Cook time:** X min | **Total:** X min
**Serves:** 5 (+ leftovers) | **Healthiness:** X/10 | **Deliciousness:** X/10 | **Cost:** ~$X

### Ingredients
- [ ] [quantity] [ingredient]
...

### Instructions

[Step Group Name]:
- [ ] [Action with **bold quantity + ingredient** inline]
- [ ] [Next step with **bold quantity + ingredient** inline]

[Next Step Group]:
- [ ] ...

### Leftover Ideas
- Day 2: [repurpose suggestion]
```

**Rules:**
- Every ingredient amount appears **bold** inline in the step where it's used
- Checkbox format (`- [ ]`) for ingredients and steps
- Steps grouped under descriptive headings
- Portions for 5 adults; larger for leftover-generating meals

### Example

```
## Le Creuset Chicken
*One-pot creamy chicken with summer vegetables*

### Ingredients
- [ ] 2.5 lbs boneless chicken thighs, cubed
- [ ] 1 lb pasta (penne or fusilli)
- [ ] 2 zucchini, sliced
- [ ] 2 yellow squash, sliced

### Instructions

Cook the Chicken:
- [ ] In a Le Creuset pot, heat a **bit of olive oil** over medium heat.
- [ ] Add **2.5 lbs cubed chicken thighs** seasoned with **salt and pepper**.
- [ ] Cook until browned and cooked through, then remove and set aside.

Sauté Aromatics:
- [ ] In the same pot, add **a little more olive oil** if needed.
- [ ] Add **1 diced onion** and **4 cloves minced garlic**, sautéing until translucent and fragrant.
```

## Grocery List Organization

Organize by store section in this order:
1. Produce
2. Meat / Seafood
3. Dairy / Eggs
4. Bakery
5. Canned / Jarred Goods
6. Dry Goods / Pasta / Rice
7. Frozen
8. Condiments / Sauces
9. Spices / Seasonings
10. Beverages
11. Other / Household

Each item uses checkbox format. Flag items on sale at the grocery store. Always cross-reference the final list against all recipe ingredients + pantry inventory to catch missing items.

**Staples check:** Query the "Staples" entry in the Notion Menu database (live from Notion, not a hardcoded list) and compare each staple item against the pantry inventory. Any staple not confirmed on hand should be added to the grocery list under the appropriate store section.

## Skills (Slash Commands)

- `/weekly-menu` — Full weekly workflow: archive, deals, inventory, menu, recipes, grocery list, push to Notion
- `/meal-ideas` — Quick standalone meal suggestions for mid-week inspiration
- `/add-recipe` — Add a recipe (from any format) to the Notion Menu database
- `/setup` — First-time setup: connect Notion, choose grocery store, discover page structure

## Project Layout

```
.env.example                   — Template for required environment variables
scripts/fetch_ads.py           — Downloads grocery store weekly ad images
images/ads/                    — Downloaded ad flyer images
images/pantry/                 — User pantry photos
images/freezer/                — User freezer photos
images/produce/                — User produce drawer photos
data/notion_structure.md       — Discovered Notion page structure (generated by /setup)
data/current_week/             — This week's generated files
data/archive/                  — Previous weeks (YYYY-MM-DD folders)
```
