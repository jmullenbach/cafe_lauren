# Setup

First-time setup for Cafe Lauren. Connects to your Notion workspace, discovers your page structure, and configures your grocery store for weekly ad scanning.

## Prerequisites

- A Notion account with a page that has (or will have) a "To Buy:" section, a "Staples:" section, and an inline Menu database
- A Notion internal integration with access to that page (create one at https://www.notion.so/my-integrations)
- Python 3.9+ with a virtual environment

## Step 1: Python Environment

1. Check if `.venv/` exists. If not, tell the user to create it:
   ```
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```
2. If `.venv/` exists, verify dependencies are installed by running: `.venv/bin/pip install -r requirements.txt`

## Step 2: Create `.env` from Template

1. Check if `.env` exists.
2. If it does, read it and check which values are already populated vs still placeholder values.
3. If it doesn't exist, copy `.env.example` to `.env` using the Bash tool.

## Step 3: Notion API Token

1. Ask the user for their Notion Internal Integration Token.
   - Direct them to https://www.notion.so/my-integrations if they need to create one.
   - The integration needs "Read content", "Update content", and "Insert content" capabilities.
   - They must also share their Grocery List page with the integration (click "..." on the page → "Connections" → add the integration).
2. Write the token to `.env` as `NOTION_API_TOKEN`.
3. Test the connection by making a simple API call (e.g., `GET /v1/users/me`). If it fails, help the user troubleshoot.

## Step 4: Notion Page Discovery

1. Ask the user for their Grocery List page URL or ID.
   - They can paste the full Notion URL (e.g., `https://www.notion.so/workspace/Page-Name-abc123def456`) or just the page ID.
   - Extract the page ID from the URL if needed (the 32-character hex string at the end).
2. Write the page ID to `.env` as `NOTION_GROCERY_PAGE_ID`.
3. Use the Notion API to fetch the page's child blocks (`GET /v1/blocks/{page_id}/children`).
4. Discover and record:
   - The **"To Buy:" paragraph block** — look for a paragraph block with text containing "To Buy". Save its ID as `NOTION_TO_BUY_BLOCK_ID`.
   - The **"Staples:" paragraph block** — look for a paragraph block with text containing "Staples". Save its ID as `NOTION_STAPLES_BLOCK_ID`.
   - The **inline Menu database** — look for a `child_database` block. Save its ID as `NOTION_MENU_DB_ID`.
5. If any of these are missing, inform the user what's needed:
   - "To Buy:" — a paragraph with the text "To Buy:" followed by `to_do` blocks for grocery items
   - "Staples:" — a paragraph with bold text "Staples:" followed by `to_do` blocks for recurring items
   - Menu database — an inline database with at least Title, Tags (select), Stars (number), and Ingredients (rich_text) properties
   - Offer to help create the missing structure.

## Step 5: Find the Staples Entry

1. Query the Menu database (`$NOTION_MENU_DB_ID`) for an entry titled "Staples".
2. If found, save its page ID as `NOTION_STAPLES_PAGE_ID` in `.env`.
3. If not found, ask the user if they'd like to create one:
   - Create a new page in the Menu database with Title "Staples"
   - Set the Ingredients field with a starter list of common household staples
   - Save the new page ID as `NOTION_STAPLES_PAGE_ID`

## Step 6: Grocery Store Configuration

1. Ask the user which grocery store they want to scan for weekly deals:
   - **Cermak Produce** — built-in scraper, automatic image detection
   - **Other store** — user provides the weekly ads URL, images are scraped generically
   - **Skip** — no ad scanning, user can manually add images to `images/ads/`
2. Based on the choice:
   - Cermak: set `GROCERY_STORE=cermak` and `GROCERY_STORE_URL=https://www.cermakproduce.com/weekly-ads/`
   - Other: set `GROCERY_STORE=other` and `GROCERY_STORE_URL=[user-provided URL]`
   - Skip: set `GROCERY_STORE=none` and `GROCERY_STORE_URL=`
3. Write both values to `.env`.

## Step 7: Generate Structure File

1. Write the discovered Notion page structure to `data/notion_structure.md`.
2. Use the template format from the existing file but populate with the actual structure found (block types, section descriptions, database schema).
3. Reference env var names (not raw IDs) in the generated file.

## Step 8: Verify & Confirm

1. Read back the `.env` file and confirm all values are populated.
2. Test the full Notion connection by:
   - Fetching the Grocery List page title
   - Querying the Menu database for a count of recipes
3. Print a summary:
   - Notion page: connected (with page title)
   - Menu database: X recipes found
   - Grocery store: [name] configured
   - Staples entry: found (X items)
4. Tell the user: "Setup complete! Run `/weekly-menu` to plan your first week."
