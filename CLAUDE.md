# Cafe Lauren — Weekly Meal Planning & Grocery List

A Claude Code project for weekly meal planning for a family of 5. Integrates with Notion for the grocery list/recipe database, a local grocery store for weekly deals, and phone photos for pantry inventory.

## The App on the Raspberry Pi

The household uses a web app served from a Raspberry Pi at `http://cafe.local:8080` (home Wi-Fi only). The code is in `backend/` (FastAPI, SQLite) and `frontend/` (React PWA). `docs/BUILD_PLAN.md` has the design. The Notion workflow and slash commands described further down are the older system and are being retired.

**The Pi holds the only real copy of the household's data.** The database on this Mac is a development copy. Protecting the Pi's database matters more than shipping any change.

### Rules

- Data flows Pi → Mac only. Never run `deploy/copy-data.sh`; it overwrites the Pi's database with the Mac's and was for the first install.
- Never edit, replace or delete files in `~/cafe_lauren/data/` on the Pi by hand. Use the scripts below.
- Never push without the tests passing. Do not use `--skip-tests` or `--allow-dirty` unless the user asks for it.
- Ask the user before pushing a change that includes a new database migration, and before running `deploy/restore.sh`.
- Do not print or copy the contents of `.env`.

### Making a change

1. To test against real data, stop the local app and run `deploy/pull-data.sh`. It replaces the Mac's development database and photos with a fresh copy from the Pi.
2. Make the change. Run the app locally: `uv run uvicorn cafe.main:create_app --factory --port 8080` in `backend/`, and `npm run dev` in `frontend/`.
3. Run `uv run pytest` in `backend/`. For screen changes also run `npm run test:e2e` in `frontend/`.
4. Commit. `deploy/push.sh` refuses uncommitted changes, so every push can be rolled back.
5. Run `deploy/push.sh`. It runs the backend tests, builds the frontend, copies `backend/`, `frontend/dist/` and `deploy/` to the Pi, restarts the service and waits for the health check. It never touches the Pi's `data/` or `.env`.

`deploy/push.sh --dry-run` runs the tests and build and lists what would be copied, without changing the Pi.

### Database changes

A change to `backend/cafe/models.py` needs a new migration in `backend/migrations/versions/`. The app applies migrations when it starts, and copies the database into `data/backups/` first.

- Run `deploy/pull-data.sh`, then start the local app, so the migration is tried on a copy of the real data before it reaches the Pi.
- Prefer migrations that add tables or columns. Avoid dropping or renaming in the same change that stops using the old name.
- Run `deploy/fetch-backup.sh` just before the push, so a copy exists off the Pi.

### If a push goes wrong

- Code only: `deploy/push.sh --ref <earlier commit>` ships that commit. `deploy/restore.sh` with no arguments lists recent pushes.
- A migration damaged or changed data: run `deploy/push.sh --ref <earlier commit>`, then `deploy/restore.sh <backup name>` with the backup taken before the migration. Anything the family entered after that backup is lost, so tell the user first.
- `deploy/restore.sh` saves the database it replaces as `before-restore-<time>.db`, so a restore can be undone.

### The Pi

- Log in with `ssh cafe`. The user is `joe`; the app is in `~/cafe_lauren`.
- The app runs as a per-user systemd service: `systemctl --user status cafe-lauren`, logs with `journalctl --user -u cafe-lauren`.
- `sudo` does not work on the Pi (the account has no password), so nothing in `deploy/` may depend on it.
- The SD card is slow. The app can take a few minutes to answer after a restart; `push.sh` waits up to five.
- Long SSH sessions to the Pi can drop over its Wi-Fi. Keep remote commands short, as `push.sh` does: start the work detached, then check on it with new connections.
- Backups: nightly at 3:30am into `data/backups/` on the Pi (14 kept). `deploy/fetch-backup.sh` copies them and the photos to `data/pi-backup/` on the Mac.
- Rebuilding the Pi from nothing: `deploy/flash-sd.sh`, `deploy/add-wifi.sh`, `deploy/push.sh --with-env`, then `deploy/restore.sh data/pi-backup/backups/<newest file>`, which uploads that backup and the photos and restores it.

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

### Clearing Grocery List Items
When pushing a new week's grocery list to Notion:
- **Only delete checked (completed) to_do items** from "To Buy" and "Staples" sections
- **Never delete unchecked items** — these are items the user hasn't bought yet
- If unchecked items exist, notify the user and confirm whether to keep or remove them before proceeding
- When the user confirms keeping unchecked items, **incorporate them into the correct store section** of the new grocery list (e.g. cornstarch goes under Dry Goods, yogurt under Dairy). Do not leave them floating at the top unsorted.

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
- **Leidy's meals:** Leidy cooks 1-2 meals per week for the whole family. These are part of the main weekly menu (not separate). Ask the user what Leidy is cooking and include those meals in the schedule, tagged to their day like any other meal. All ingredients go on the shared grocery list.

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

Organize by store section in this order (matches the store layout):
1. Produce
2. Frozen
3. Meat / Deli / Bakery
4. Dry Goods / Canned / Condiments / Pasta / Rice / Spices
5. Dairy / Eggs
6. Beverages

Every item must belong to one of these 6 categories — never use a catch-all like "Other / Household". Chips, crackers, and snack items go in Dry Goods. Deli meats and cheeses go in Meat / Deli / Bakery.

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
images/pantry/                 — Repo copy of pantry photos (may be stale)
data/notion_structure.md       — Discovered Notion page structure (generated by /setup)
data/current_week/             — This week's generated files
data/archive/                  — Previous weeks (YYYY-MM-DD folders)
```

## Pantry Photos

- **Primary source:** `/Users/mojo/Joe Drive/_pantry/` (synced from Google Photos via Google Drive)
- **Fallback:** `images/pantry/` in this repo (older photos, treat as out of date if Drive folder has newer ones)
- All food-on-hand photos go in one folder — freezer, fridge, pantry, produce, counter, etc. No separate subfolders.
- Always check the Drive folder first for the latest photos. Compare file timestamps to determine freshness.
