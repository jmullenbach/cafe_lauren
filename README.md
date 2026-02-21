# Cafe Lauren

An AI-powered weekly meal planner built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Plans meals for a family of 5, scans grocery store deals, inventories your pantry from photos, generates recipes, and pushes a grocery list straight to Notion.

## What It Does

- **Weekly meal planning** — generates 4-5 cook-fresh meals per week with leftover days mapped out
- **Grocery store deal scanning** — downloads weekly ad flyers and identifies sales on your preferred proteins and vegetables
- **Pantry inventory from photos** — drop photos of your pantry, freezer, and produce drawer; the AI identifies what you have on hand
- **Smart grocery list** — cross-references recipes, pantry inventory, store deals, and household staples into one organized list
- **Notion integration** — pushes the grocery list and meal tags directly to a Notion page so the whole family can see it
- **Recipe database** — maintains a library of family recipes in Notion with ratings and ingredients

## How It Works

This project uses Claude Code slash commands to orchestrate the full workflow:

| Command | What it does |
|---------|-------------|
| `/setup` | First-time setup — connects Notion, configures your grocery store |
| `/weekly-menu` | Full weekly workflow: archive last week, scan deals, inventory pantry, plan meals, generate recipes, build grocery list, push to Notion |
| `/meal-ideas` | Quick mid-week inspiration based on what's in your pantry and on sale |
| `/add-recipe` | Add a recipe from any format (text, URL, photo, or description) to your Notion database |

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- A [Notion](https://notion.so) account with an internal integration
- Python 3.9+

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/cafe-lauren.git
   cd cafe-lauren
   ```

2. **Set up Python environment:**
   ```bash
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```

3. **Run setup:**
   ```
   /setup
   ```
   This will walk you through:
   - Connecting your Notion integration (you'll need an [internal integration token](https://www.notion.so/my-integrations))
   - Pointing to your Grocery List page in Notion
   - Choosing your grocery store for weekly ad scanning

4. **Plan your first week:**
   ```
   /weekly-menu
   ```

## Notion Page Structure

The project expects a Notion page with:

1. **"To Buy:" section** — a paragraph header followed by to-do blocks (the grocery list)
2. **"Staples:" section** — a paragraph header followed by to-do blocks (recurring household items)
3. **Inline Menu database** — with these properties:
   - **Title** (title) — meal name
   - **Tags** (select) — day of the week assignment
   - **Stars** (number) — rating (1-5)
   - **Ingredients** (rich text) — ingredient list

The `/setup` command will discover this structure automatically from your page.

## Project Structure

```
.env.example                   — Template for environment variables
CLAUDE.md                      — Project instructions for Claude Code
.claude/commands/              — Slash command definitions
  setup.md                     — /setup command
  weekly-menu.md               — /weekly-menu command
  meal-ideas.md                — /meal-ideas command
  add-recipe.md                — /add-recipe command
scripts/fetch_ads.py           — Grocery store ad image downloader
images/                        — Downloaded ad images, pantry/freezer/produce photos
data/                          — Generated files (current week, archives)
```

## Customization

This project is designed around one family's preferences but is easy to adapt:

- **Family size** — change "5 people" in `CLAUDE.md` to your household size
- **Proteins & cooking methods** — edit the "Meal Constraints" section in `CLAUDE.md`
- **Grocery store** — run `/setup` to configure any store, or manually add ad images to `images/ads/`
- **Staples list** — edit the "Staples" entry in your Notion Menu database

## Running Free with Google Antigravity

No Anthropic API key needed — use [Antigravity's](https://idx.google.com/antigravity) free Claude models:

- `npm install -g antigravity-claude-proxy`
- `antigravity-claude-proxy start` (authenticate with Google when prompted)
- Add to `~/.claude/settings.json`:
  ```json
  {
    "env": {
      "ANTHROPIC_BASE_URL": "http://localhost:8080",
      "ANTHROPIC_AUTH_TOKEN": "test",
      "ANTHROPIC_MODEL": "claude-opus-4-5-thinking"
    }
  }
  ```
- Run `claude` in the project directory — it routes through Antigravity for free

## License

MIT
