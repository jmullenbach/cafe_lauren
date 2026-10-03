# Cafe Lauren — Design System

Cafe Lauren is a family meal-planning and grocery-ordering system for a household of five (two parents, small kids, and Leidy, who cooks 1–2 family meals a week). It runs on a weekly loop:

1. **Gather** — household members send requests (meal ideas, "we're out of…"), and pantry / fridge / freezer photos are inventoried.
2. **Plan** — the system scans the grocery store's weekly ad (Cermak Produce), suggests 4–5 cook-fresh meals plus leftover days, and the household votes to reach consensus.
3. **Recipes** — existing family recipes come from the recipe box; missing ones are researched or generated in a fixed format.
4. **List** — a grocery list is built and sorted by store section, cross-checked against recipes, staples and pantry.
5. **Order** — the list goes to Instacart; delivery is typically on the weekend.
6. **Cook** — the recipe is shown step-by-step during cooking, then the family leaves ratings and notes.

Audience: busy parents and caretakers. The look should feel like a well-kept modern kitchen — Crate & Barrel / CB2 calm: linen, oak, cast iron, herbs, clay — healthy and homey, never juvenile.

## Sources
- **Codebase:** `cafe_lauren/` (local mount, read-only). It is a Claude Code CLI project (slash commands `/weekly-menu`, `/meal-ideas`, `/add-recipe`, `/setup`), Python Notion helpers, and generated markdown under `data/`. **It contains no UI, no CSS, no logo and no fonts.** Product structure, vocabulary, data formats and copy were taken from `README.md`, `CLAUDE.md`, `.claude/commands/weekly-menu.md`, `data/notion_structure.md`, `data/current_week/*` and `data/archive/*`.
- Photos copied from `cafe_lauren/images/pantry/` and `images/ads/`.
- The visual system itself (color, type, components) was authored from scratch for this project.

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`
- `fonts/` — Newsreader + Figtree variable woff2 (Google Fonts, OFL)
- `assets/icons/` — 80 Lucide SVGs (v0.460.0); `assets/photos/` — pantry photos, a weekly ad page
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives, each `Name.jsx` + `Name.d.ts` + `Name.prompt.md`, one `*.card.html` per folder
- `ui_kits/app/` — the Cafe Lauren web app (see its README)
- `thumbnail.html`, `SKILL.md`

## Components
- **core/** — Icon, Button, IconButton
- **forms/** — Input, Select, Checkbox, Switch, SegmentedControl, ChoiceChips
- **display/** — Badge, DayTag, Card, Avatar, AvatarStack, Score, Stars
- **navigation/** — Tabs, SideNav, TabBar
- **feedback/** — Dialog, Toast, Tooltip, Sheet
- **kitchen/** — MealCard, GroceryItem, RecipeStep, VoteButtons, PhotoTile, SuggestedTag, ReviewActions

No source defined a component inventory, so this is an authored standard set sized to the product. Domain components (`kitchen/`) encode formats from the source: the recipe format (bold quantities inline, checkbox steps, grouped headings), the grocery-line format (**qty** item — meal, sale price), the Notion day tags, and Healthiness/Deliciousness x/10 ratings.

**Intentional additions:** `Icon` (wrapper for the bundled Lucide set), `DayTag` (Notion "Tags" select), `Score`/`Stars` (meal ratings in source), `VoteButtons` (household consensus), `PhotoTile` (pantry photo intake), `SuggestedTag` + `ReviewActions` (the human-approval pattern for AI output), `TabBar`, `Sheet`, `ChoiceChips` (phone-first app).

## UI kits
- `ui_kits/mobile/index.html` — **primary, phone-first** clickable prototype: Home (2 layouts), Plan review (2 layouts), meal detail + editing, swap / reject-with-reason sheets, Inbox (requests + pantry review), Recipe box + add recipe, Grocery list → Instacart order review → delivery tracking, and the Ask Café chat. Layouts and "viewing as" are Tweaks.
- `ui_kits/app/index.html` — This week · Requests & pantry · Grocery list + Instacart · Cook mode + feedback. Designed from the workflow, not recreated (no UI exists in source).

---

## AI SUGGESTION & APPROVAL RULES
Café (the AI planner) proposes; a person decides. If people start working around it, it has failed.
- **Everything AI-made starts as a suggestion** and wears a dashed `SuggestedTag` until a person keeps, edits, swaps or rejects it. Dashed border = nobody has looked yet.
- **Always show why.** Every suggestion carries its reasons (sale price, request, pantry item, favorite) in a sage "Why Café suggested this" panel.
- **Every suggestion is rejectable with feedback.** "Not this" opens reason chips + optional note + "Remember this"; the person then chooses "Suggest another" or "Leave night open". The reason is echoed back on the replacement ("You said: Too much work").
- **Swaps are cheap.** Swap sheet = preference chips, free-text ask, 3 options, recipe box, or "Leftovers / Leidy cooks / Eating out".
- **Chat never edits directly.** Ask Café replies with proposal cards that need Apply or "Not that".
- **Approval isn't a lock.** After the week is approved, edits still work; the grocery list shows a +/− diff to confirm.
- **Uncertain AI reads are flagged, not hidden:** pantry items "Not sure", Instacart matches "Check these" — and ordering is blocked until flagged items are checked.
- **Votes are opinions; Keep is a decision.** Swapping resets votes so everyone can weigh in.

## CONTENT FUNDAMENTALS
**Voice:** a capable friend who runs a calm kitchen. Practical, warm, brief. Talks to the household as "we" ("so we don't buy what you already have") and addresses the person as "you". Never cutesy, no kid-speak, no exclamation-point cheer.

**Casing:** Sentence case everywhere — buttons, headings, nav ("Grocery list", "Send to Instacart", "How was dinner?"). Uppercase only for overlines and DayTags (tracked +0.12–0.14em). Recipe and meal titles are Title Case, as in the source ("Sheet Pan Citrus Chicken Thighs and Roasted Tomatoes").

**Formats lifted from source:**
- Meal = Title + one italic sentence: *"Warm orzo tossed with tomatoes, green onion, basil, lemon, feta and sautéed shrimp."*
- Meta line: "Skillet · 30 min · ~$26", "Healthy 8/10 · Delicious 9/10".
- Grocery line: "**2 lbs** green beans — pork chops + citrus chicken" with sale "$0.99/lb".
- Recipe steps: every amount **bold** inline — "Add **2.5 lbs cubed chicken thighs** seasoned with **salt and pepper**."
- Leftovers: "Day 2: shred into wraps with deli cheese".
- Store sections, always in this order: Produce · Frozen · Meat / Deli / Bakery · Dry Goods / Canned / Condiments · Dairy / Eggs · Beverages. Never "Other".
- Cooking methods by name: Sheet pan, Instant Pot, Le Creuset, Skillet.

**Numbers:** prices as "$3.49/lb", "10/$1", "~$22"; times as "30 min"; dates as "Week of August 24", "Aug 13–26".

**Emoji:** the source markdown uses 🔥 🥬 🧊 ✔ ⚠️ as markers. **The UI does not** — these map to icons: 🔥 → terracotta `tag` Badge; section emoji → Lucide food icons; ✔ → Checkbox; ⚠️ → `triangle-alert` on a honey warning panel.

**Examples:** "Approve menu" · "Waiting on 2 votes" · "These photos are from March. Add fresh ones…" · "Keep 3 unchecked items?" · "Ratings and notes go back into the recipe box, so next week's plan gets better."

## VISUAL FOUNDATIONS
**Color.** Warm neutrals do the work; accents are sparse. Page is linen `#FBF8F3` (never pure white); cards are warm white `#FFFDF9`; the sidebar and recessed panels are linen-100. Ink is cast-iron charcoal `#24221F`, which is also the primary button. Sage (`#5C7150`) is the brand accent for approving, success, focus, checked boxes. Terracotta (`#B8603D`) marks sales and "delicious". Honey marks ratings, timers and warnings. Day-of-week colors are muted versions of the Notion tag palette. No gradients except the photo protection gradient.

**Type.** Newsreader (serif, optical sizes) for display, page titles, meal titles and the italic one-line description — set light (300) at large sizes, regular below 30px, tracking −0.015em. Figtree for all UI and body text; 600 for labels/buttons, 650 for bold quantities. Scale: 64/48/36 display, 30/24 serif headings, 19 sans h3, 17/15/13 body, 12 caption, 11 overline.

**Spacing & layout.** 4px base (2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96). Page padding 40, gutter 24, card padding 20–28, list rows 12px vertical. Fixed 248px linen sidebar; content max ~1240px; right-hand sticky summary panels (order, ingredients). Generous whitespace — the interface should breathe like a showroom.

**Backgrounds & imagery.** Flat linen surfaces, no textures or patterns, no illustrations. Imagery is real household and food photography: warm, natural light, unfiltered. Photos sit in 10px-radius frames, `object-fit: cover`; captions over photos use the bottom protection gradient (`--photo-protect`). Without a photo, show a linen-200 panel with a faint cooking-pot icon — never a drawn illustration.

**Corners.** Crisp, not bubbly: 3px badges/tags, 6px controls, 10px cards and photos, 16px dialogs, pill only for segmented controls, vote buttons and avatars.

**Cards.** Warm-white fill, 1px linen-200 hairline border, `--shadow-1` (barely there). Interactive cards lift 1–2px with `--shadow-2` on hover. Selected = sage-500 border + 2px sage-100 halo. Sunken (linen-100, no shadow) for secondary info; accent (sage-50) for gentle highlight. Never a colored left-border.

**Shadows.** Charcoal-tinted (rgba 36,34,31), soft and low: shadow-1 resting, shadow-2 hover/raised, shadow-3 dialogs and toasts; inset shadow in input wells.

**Borders.** 1px hairlines in linen-200/300; 1.5px for checkboxes and dashed upload slots.

**Hover / press.** Hover darkens solid buttons one step (charcoal → #3A3732, sage-600 → 700) and gives ghost/secondary a linen-100/200 fill; rows get a linen-100 wash. Press scales buttons to 0.98. Focus is a 3px sage ring (`--focus-ring`).

**Motion.** Quiet and quick: 140ms (hover, checks), 220ms (card lift, switch), 360ms (photo zoom). `cubic-bezier(.2,.7,.2,1)` ease-out; fades and small translates only, no bounce or spring.

**Transparency & blur.** Used sparingly: the dialog scrim (charcoal 42% + 2px blur) and small glass buttons over photos (`--glass-bg` + blur). Never on content cards.

## ICONOGRAPHY
- **Set:** [Lucide](https://lucide.dev) v0.460.0, line icons, 24-grid, round caps/joins, **1.5px stroke** (1.25 at 32px+). The source codebase has no icons; Lucide was chosen as the closest fit to the calm, line-drawn kitchen look. **This is a substitution — swap if you have a preferred set.**
- **Files:** 80 SVGs in `assets/icons/`; the same paths are inlined in `components/core/icon-paths.js` and rendered by `<Icon name="carrot" />` with `currentColor`. In plain HTML, use the files directly or the `.cl-icon` mask helper: `<span class="cl-icon" style="--icon:url(assets/icons/carrot.svg);width:20px;height:20px"></span>`.
- **Usage:** 16px inline with meta text, 18–20px in controls and section headers, 24px nav, 28–40px empty/upload states. Icons are text-muted by default, sage for section headers and active nav, terracotta for sale.
- **Store sections:** Produce `carrot`, Frozen `snowflake`, Meat `beef`, Dry goods `wheat`, Dairy `milk`, Beverages `cup-soda`. Methods: `cooking-pot`; time `clock`; cost `receipt`; cook `chef-hat`; leftovers `refresh-cw`; sale `tag`; delivery `truck`.
- **No emoji, no unicode glyph icons** in the UI (the arrow "→" may appear in copy, e.g. "Taco leftovers → taco-salad bowls", as in source).
- **Logo:** none was provided. The wordmark is "Café Lauren" (with the acute accent) set in Newsreader 400 — do not draw a mark.

## Fonts
Newsreader and Figtree are Google Fonts (OFL), chosen because the source has no brand fonts. Files are local in `fonts/`. **Substitution — send brand font files if they exist.**
