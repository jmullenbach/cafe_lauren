# Cafe Lauren app — UI kit

Desktop/tablet web app (1280×800 design size) for the weekly cycle. Open `index.html`.

**Not a recreation.** The source codebase (`cafe_lauren/`) is a Claude Code CLI workflow that writes markdown and pushes to Notion — it has no UI. These screens are a first design of that workflow, built only from the design-system components and the real data in `data/current_week/` (menu, grocery list, deals) and `data/archive/` (recipes, pantry). Copy is lifted from those files wherever possible.

Screens (sidebar nav, state persists in localStorage `cl-screen`):
- `WeekScreen.jsx` — This week: 7-day schedule strip (cook / leftover / Leidy days), cook-fresh MealCards with household voting, Approve menu.
- `IntakeScreen.jsx` — Requests & pantry: add a meal idea or "we're out of", pantry photo tiles, on-hand list, Cermak deals.
- `GroceryScreen.jsx` — Grocery list by the six store sections (or by meal), sale tags, staples tab, Instacart order panel → confirm dialog → toast.
- `CookScreen.jsx` — Tonight: ingredient checklist + large step-by-step (cook mode), then "How was dinner?" feedback dialog.
- `AppShell.jsx` — SideNav, wordmark, delivery status, PageHeader, SectionTitle.
- `data.js` — sample data.
