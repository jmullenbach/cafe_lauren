# Add Recipe

Add a recipe to the Notion Menu database from any format. Accepts pasted text, a URL, a photo, or a free-form description.

## Step 1: Accept Recipe Input

Check if the user provided input with the command (e.g., `/add-recipe [pasted recipe text]`). If not, ask:
- "Paste a recipe, share a URL, drop a photo, or just describe a meal and I'll build the recipe."

Supported input formats:
- **Pasted text** — recipe from a website, cookbook, or notes
- **URL** — fetch the page and extract the recipe
- **Photo** — read the image (screenshot of a recipe, photo of a cookbook page)
- **Description** — "chicken thighs with roasted vegetables, sheet pan style" — generate a full recipe

## Step 2: Parse & Normalize

1. Extract from the input:
   - **Title** — meal name
   - **Ingredients** — full ingredient list with quantities
   - **Instructions** — cooking steps
   - **Cooking method** — sheet pan, instant pot, Le Creuset, skillet, or other
   - **Prep/cook time** — if mentioned
2. Normalize into the project's standard recipe format (see CLAUDE.md for the full format):
   - Checkbox format for ingredients and steps
   - Bold quantities inline in instruction steps
   - Steps grouped under descriptive headings
   - Portions scaled for 5 people (adjust if the source recipe serves a different number)
3. Add ratings estimates:
   - Healthiness (0-10)
   - Deliciousness (0-10)
   - Approximate cost for 5 people
4. Add leftover ideas if the meal is a good candidate.

## Step 3: Confirm with User

Present the formatted recipe and ask:
- "Does this look right? Any changes before I add it to Notion?"
- Let them adjust ingredients, title, portions, etc.
- Optionally ask for a star rating (1-5) if they've made it before.

## Step 4: Push to Notion

1. Read `.env` to get `NOTION_API_TOKEN` and `NOTION_MENU_DB_ID`.
2. Create a new page in the Menu database via `POST /v1/pages`:
   - **Parent:** `{ "database_id": "$NOTION_MENU_DB_ID" }`
   - **Title:** the meal name
   - **Ingredients:** rich text with the checkbox-format ingredient list
   - **Stars:** user's rating if provided, otherwise leave empty
   - **Tags:** leave empty (will be assigned during weekly planning)
3. Optionally, add the full recipe instructions as child blocks on the new page (paragraphs, to_do blocks for steps).

## Step 5: Confirm

1. Print: "Added '[Recipe Title]' to your Menu database."
2. Provide the Notion page URL for the new entry.
3. Print the current recipe count in the database.
