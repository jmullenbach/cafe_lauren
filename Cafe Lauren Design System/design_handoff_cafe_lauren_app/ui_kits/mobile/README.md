# Café Lauren — phone app (primary)

Phone-first clickable prototype (402×874 iPhone frame). Open `index.html`. Tweaks: Home layout A/B, Plan review layout A/B, Viewing as Lauren/Joe/Leidy (same app for everyone; resets demo state).

Designed from the cafe_lauren workflow and data; there is no existing UI to recreate.

- `store.jsx` — all demo state + actions (keep/swap/reject/approve, list built live from the plan, pantry, cart, order, chat proposals)
- `Shell.jsx` — PhoneApp layout, TabBar, Ask Café button, shared bits (LargeTitle, BackHeader, Why, ListRow, BottomBar)
- `HomeScreens.jsx` — A: tonight + "Needs you" + week; B: 5-step weekly cycle tracker + household activity
- `PlanScreens.jsx` — A: whole week list with inline Keep/Swap/Not this; B: one suggestion at a time, then the week
- `MealSheets.jsx` — Swap, Reject-with-reason, Change (move day, who cooks, leftovers, remove)
- `MealDetail.jsx` — meal/recipe detail, ingredient editing, servings, phone cook mode, AI draft recipes
- `InboxScreen.jsx` — requests (reply: add to plan / not this week) and pantry photos → review what Café found
- `RecipesScreen.jsx` — recipe box + Add recipe (describe / link / photo / paste)
- `ListScreens.jsx` — grocery list (+/− diff after approval), Instacart order review with flagged matches, delivery tracking with substitution approval
- `ChatSheet.jsx` — Ask Café with apply/dismiss proposals
- `ios-frame.jsx`, `tweaks-panel.jsx` — starter scaffolds
