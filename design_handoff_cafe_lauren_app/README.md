# Handoff: Café Lauren app (phone-first) + design system

## Overview
A phone-first web app for the existing `cafe_lauren` Claude Code workflow. Today the workflow runs as slash commands (`/weekly-menu`, `/meal-ideas`, `/add-recipe`, `/setup`) that write markdown to `data/current_week/` and push to Notion. This design turns each step of that loop into screens that the whole household (Lauren, Joe, Leidy) can use. The steps are: gather requests and pantry photos, plan and vote, recipes, grocery list, order, cook.

## About the design files
Everything in this folder is a **design reference built in HTML/React-in-the-browser**. It is a clickable prototype that shows the intended look and behavior, not production code. Rebuild it in a real app stack and reuse the existing Python (`scripts/notion_helpers.py`, `scripts/fetch_ads.py`) as the backend. The repo has no frontend yet. A reasonable choice is a **mobile-first PWA**: Next.js or Vite + React, the CSS tokens in `tokens/` copied as-is, and a small API (FastAPI fits the existing Python) wrapping the helper scripts and the Claude API.

To view: open `ui_kits/mobile/index.html` in a browser served from this folder (e.g. `python3 -m http.server` here, then visit `/ui_kits/mobile/`). The Tweaks toggle switches Home A/B, Plan A/B and "viewing as" between household members.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, shadows, copy and interactions are final. Recreate them precisely. The AI responses in the prototype are scripted. Café's chat, suggestions and pantry reads must be wired to the Claude API (see "AI integration").

## Non-negotiable product rule: people approve, Café proposes
Read `DESIGN_SYSTEM.md → AI SUGGESTION & APPROVAL RULES`. In short:
- Every AI output (meal, recipe, pantry item, product match, chat change) starts as **suggested** (dashed `SuggestedTag`) and only changes state through a person: keep / edit / swap / reject.
- Reject always collects a reason (chips + note + "Remember this"). The reason is sent back to the model and echoed on the replacement ("You said: Too much work").
- Chat never writes to the plan. It returns **proposals** the user Applies or dismisses.
- Approval doesn't lock the week. Later swaps produce a grocery **+/− diff** to confirm.
- Uncertain reads are flagged ("Not sure" pantry items, "Check these" product matches). Ordering stays blocked until flagged product matches are checked.
- Votes are opinions, and Keep is a decision. A swap resets that night's votes.

## Screens (ui_kits/mobile)
Phone frame 402×874. Content padding 20px. Top safe area 58px. The bottom TabBar is about 84px including a 26px home-indicator pad. Tabs: Home, Plan, List, Recipes, Inbox. The "Ask Café" pill (charcoal, 48px, bottom 100px, right 16px) appears on every tab except Plan, which has its own sparkle button.

1. **Home A** (`HomeScreens.jsx → HomeA`): greeting LargeTitle (overline 11px/600 +0.14em, title Newsreader 300 36px). Below it: a Tonight card (150px photo area, DayTag "Tonight", Swap + Start cooking), a "Needs you" list built from live state (suggestions to review, pantry check, new requests, list diff, shopper question), the week mini-list and a delivery row.
2. **Home B** (`HomeB`): 5-step cycle bar (Gather · Plan · List · Order · Cook; 4px segments, sage done / charcoal current / linen-300 todo), one raised current-step card with a single CTA, Tonight row, and household activity feed.
3. **Plan A** (`PlanScreens.jsx → PlanA`): one card per night. Cook slots that need review get a **dashed sage-300 border** with a "why" line and ReviewActions (Not this / Swap / Keep). Reviewed slots get a solid hairline border and VoteButtons. Leftover/Leidy/open nights are sunken or dashed rows. An "Up next" queue sits below the week. A sticky frosted bar at the bottom carries "Keep the other N and approve".
4. **Plan B** (`PlanB`): one suggestion at a time: progress segments, 190px photo, title (Newsreader 300 30px), italic description, scores, Why panel, votes, and a fixed ReviewActions bar (size l). Finishes on a whole-week overview.
5. **Swap / Reject / Change / Put on a night sheets** (`MealSheets.jsx`). Sheet radius 20px top, max 88%.
   - **Swap:** preference chips (Weekly specials, Quicker, Lighter, Kid-friendly, Use what we have, Cheaper, Different protein), a free-text ask, 3 option cards, Up next, recipe box, and "Leftovers night / Leidy cooks / Eating out".
   - **Reject:** reason chips, note, "Remember this" switch, then "Leave night open" or "Suggest another".
   - **Change:** move to another day, who cooks, edit, leftovers, take off plan.
6. **Meal detail** (`MealDetail.jsx`): photo, status tag, meta, scores and Why. Ingredients are editable (remove, add, servings), with tags On hand / On list / On sale. Steps use RecipeStep and run a phone cook mode (Back / Next step, then a star rating). Leftovers. For AI-written drafts there's a honey "check before cooking" banner plus Discard / Save to recipe box. From the recipe box: Add to Up next / Put on a night.
7. **Inbox** (`InboxScreen.jsx`): segmented Requests | Pantry.
   - **Requests:** compose (Meal idea / We're out of), New requests with "Not this week" / "Add to plan", answered requests with replies.
   - **Pantry:** photo tiles, then "Review what it found".
   - **Pantry review:** rows per area, each with ✓ / ✕, tap to edit, "Not sure" flags, "+ Add to <area>" per section, "Anything it missed?", and "Confirm N items".
8. **Recipes** (`RecipesScreen.jsx`): search, filter chips, recipe rows (64px thumb, serif title, stars, last made). "Add a recipe" sheet: Describe it / Link / Photo / Paste text, leading to a draft meal detail.
9. **List** (`ListScreens.jsx → ListScreen`): store row (opens "Store & ordering"), Copy button (copies unchecked items as plain text with ☐ for Google Keep), quick-add field (parses "2 lbs apples" and auto-files it into an aisle), draft notice until the week is approved, post-approval +/− diff card, and aisle sections. Each item has a pencil (amount / name / note / remove) and each aisle has "+ Add to <aisle>". The CTA depends on the ordering method.
10. **Store & ordering sheet** (`StoreSheet`): weekly ads from Cermak Produce / Aldi / Amazon Fresh (+ add a store). Get groceries by Instacart delivery, Instacart pickup, Amazon delivery, Send the list to someone, or shop it ourselves. Store and method stay consistent (Amazon delivery switches the ads to Amazon Fresh).
11. **Send the list** (`SendSheet`): who's shopping (chips), text it, update the Notion "Grocery List" page, copy.
12. **Order review** (`OrderReview`): flagged product matches first (dashed honey border, "Change" / "Looks right"), then matched items, delivery window, substitution preference, totals. "Place order" is disabled until flags are resolved.
13. **Tracking** (`Tracking`): 4-step timeline, live substitution request (Use cotija / Refund it), and on delivery "Update pantry".
14. **Ask Café** (`ChatSheet.jsx`): bubbles (mine charcoal, Café linen-100), starter chips, and proposal cards with Apply / Not that.

A desktop/tablet version (1280 wide, sidebar) is in `ui_kits/app/` for reference. Phone is primary.

## State model (see `ui_kits/mobile/store.jsx`)
- **Week:** `slots[7]`, each `{ day, kind: cook|leftover|leidy|custom|open, meal?, text?, status: suggested|thinking|kept|edited|approved|rejected, by, basis (feedback text), votes{person:'up'|'down'}, cook }`. Plus `approvedBy` and `diff[]`.
- **Meal:** `{ title, description, method, time, cost, healthy, delicious, stars, onSale, why[], leftovers, ingredients[[qty,name,tag]] }`. This matches the recipe format in the repo's `CLAUDE.md`.
- **Other entities:**
  - `requests[{who,type:meal|out,text,status:new|planned|declined,reply}]`
  - `pantry[{area,name,qty,state:found|unsure|confirmed|removed}]`
  - `queue[{meal,by}]`
  - grocery list, *derived* from the cook slots + staples + `listAdds` + `listEdits`
  - `store`, `orderVia`, `cart decisions`, `order status`, `substitution`
  - `chat[{from,text,proposal{day,meal|text,label,detail,state}}]`
- **Feedback memory:** persist rejection reasons ("Remember this") and post-dinner ratings per meal. Feed them into the next planning prompt.

## Mapping to the existing repo
- **Deals:** `scripts/fetch_ads.py` per selected store → `deals.md` → shown as sale badges and in "why" reasons.
- **Pantry:** photos → vision read → `pantry_inventory.md` items with confidence → Pantry review.
- **Staples and recipe box:** `notion_helpers.py get-staples / search-meals` → staples on the list, recipe box.
- **Plan:** the `/weekly-menu` Step 2 constraints (4–5 cook-fresh meals, 5 people, protein + big veg, sheet pan / Instant Pot / Le Creuset / skillet, Leidy's 1–2 meals) → generate `slots` as *suggestions*.
- **Grocery list:** the 6 store sections in `CLAUDE.md`, in order, never "Other". Push via `push-grocery-list`; `clear-checked` behavior is unchanged.
- **Recipes:** `/add-recipe` → Add a recipe sheet → draft → saved to the Notion Menu database only after approval.

## AI integration
The back end calls the Claude API with structured outputs (JSON) for:
- plan suggestions, each with `why[]`
- swap options, given prefs and free text
- the replacement after a rejection, given the reason
- pantry photo reads, each with a `sure` flag
- product matching, each with a `sure` flag and a note
- recipe drafting
- chat → proposals

Never apply model output directly to state. Always create a suggestion or proposal object that the UI asks a person to resolve.

## Design tokens
Use `styles.css` → `tokens/*.css` as-is (CSS custom properties). Key values:
- **Surfaces:** page `#FBF8F3`, card `#FFFDF9`, sunken `#F5F0E8`, borders `#EBE3D6` / `#DDD2C1`
- **Ink:** `#24221F` (primary button), body `#4A4640`, muted `#78726A`
- **Sage:** 50 `#EEF1EA` · 100 `#DDE4D5` · 300 `#A9B89B` · 500 `#6F8562` · 600 `#5C7150` (accent / confirm) · 700 `#4B5E40`
- **Terracotta:** 50 `#F8ECE5` · 500 `#B8603D` (sale) · 700 `#8A4329`
- **Honey:** 100 `#F6EBC8` · 500 `#C9A23B` · 700 `#87681A`
- **Tomato:** 500 `#A8402F`
- **Type:** Newsreader (display/titles, 300 at large sizes, italic for descriptions) + Figtree (UI). Woff2 files are in `fonts/`.
- **Radii:** 3 / 6 / 10 / 16 / 20 (sheets) / pill
- **Shadows:** `--shadow-1/2/3` (charcoal-tinted)
- **Motion:** 140 / 220 / 360ms, `cubic-bezier(.2,.7,.2,1)`
- **Spacing:** 4px base (2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96)

## Assets
- `assets/icons/`: 80 Lucide SVGs (v0.460.0, ISC). Use `lucide-react` in production at stroke 1.5.
- `assets/photos/`: pantry photos and the weekly ad, from the repo.
- There are no food photos yet. Meals show a linen placeholder with a cooking-pot icon.
- No logo exists. The wordmark is "Café Lauren" set in Newsreader 400.

## Files
- `ui_kits/mobile/`: the phone prototype (primary). `store.jsx` holds all behavior.
- `ui_kits/app/`: the desktop reference.
- `components/`: React primitives, each `Name.jsx` + `Name.d.ts` (props) + `Name.prompt.md` (usage). Port these as your component library.
- `DESIGN_SYSTEM.md`: full brand, content, visual and iconography guide, plus the AI approval rules.
- `SKILL.md`: drop this folder into `.claude/skills/cafe-lauren-design/` to make it a Claude Code skill.
- `styles.css`, `tokens/`, `fonts/`, `_ds_bundle.js`: needed to view the prototypes.
