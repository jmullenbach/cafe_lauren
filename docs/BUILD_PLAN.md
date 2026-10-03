# Café Lauren app: build plan

This plan turns the `design_handoff_cafe_lauren_app/` prototype into a working app hosted on a Raspberry Pi 5 at home. It is written for the agents who will build it. Each phase lists its tasks, the files it owns, and how to tell it is done.

Read these before starting any phase:

- `design_handoff_cafe_lauren_app/README.md` (screens, state model, tokens)
- `design_handoff_cafe_lauren_app/DESIGN_SYSTEM.md`, section "AI SUGGESTION & APPROVAL RULES"
- `design_handoff_cafe_lauren_app/ui_kits/mobile/store.jsx` and `data.js` (every action and entity the backend must support)
- `CLAUDE.md` (meal constraints, recipe format, the six grocery sections)
- `.claude/commands/weekly-menu.md` (the workflow being replaced)

## 1. Decisions already made

These were settled with the owner (Joe). Do not reopen them.

| Topic | Decision |
|---|---|
| Scope | Backend plus a real phone-first PWA, both served from the Pi. |
| Data | SQLite on the Pi is the only store. Notion is retired after a one-time import. |
| Export | Everything must be exportable from inside the app. |
| Access | Home Wi-Fi only. Plain HTTP on the LAN. No login; a "who are you" picker. |
| Claude | Runs in the background on Joe's Claude subscription, not an API key. |
| Host | Raspberry Pi 5, 4GB or more, 64-bit Raspberry Pi OS. |
| Pantry photos | Uploaded from the phone inside the app. No Google Drive. |
| Automation | A scheduled job fetches ads and drafts a suggested week. People still approve everything. |
| Ordering | Instacart Developer Platform link (one tap to a pre-matched Instacart page). No browser automation. Real cart fill for Mariano's through the Kroger API comes last, in Phase 9, after the owner has tested the rest. |

Two consequences of "home Wi-Fi only, plain HTTP" that affect the frontend:

- Browsers treat `http://<pi>` as an insecure context. Service workers and `navigator.clipboard` are unavailable. The app is installable on iOS through "Add to Home Screen" with a web manifest, but it has no offline mode. The Copy button must fall back to a hidden textarea and `document.execCommand('copy')`.
- Photo capture uses `<input type="file" accept="image/*" capture>`, which works over HTTP.

## 2. Out of scope

- Order review and product matching (prototype screen 12) until Phase 9. Instacart does the matching on its own page.
- Delivery tracking and substitutions (prototype screen 13), in every phase.
- Amazon Fresh ordering. No documented cart route works for Fresh items.
- Automated browsing of instacart.com. Instacart's terms forbid it and it would put the family's real account at risk.
- Remote access, HTTPS, push notifications, user accounts.
- The desktop layout in `ui_kits/app/`.
- Home B and Plan B layouts. Build Home A and Plan A only. Keep component boundaries clean so B can be added later.

## 3. Architecture

```
Phone (PWA, React)  ──HTTP──▶  FastAPI on the Pi (port 8080)
                                 ├─ REST API  /api/*
                                 ├─ static PWA build  /
                                 ├─ uploaded photos   /media/*
                                 ├─ SQLite  (data/cafe.db)
                                 ├─ job worker (one AI job at a time)
                                 ├─ scheduler (weekly prep)
                                 ├─ Claude Agent SDK ──▶ Claude (subscription token)
                                 └─ Instacart Developer Platform ──▶ products link
```

Stack:

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy 2 with Alembic migrations, Pydantic v2, APScheduler, `claude-agent-sdk`, `httpx`, pytest.
- **Frontend:** Vite, React 18, TypeScript, React Router, TanStack Query, `lucide-react` (stroke 1.5). Plain CSS using the handoff tokens. No CSS framework.
- **Process:** one `uvicorn` process run by systemd. The job worker and scheduler run inside it as asyncio tasks.

Target layout:

```
backend/
  cafe/
    main.py            app factory, static + media mounts
    config.py          settings from .env
    db.py              engine, session
    models.py          SQLAlchemy models
    schemas.py         Pydantic API schemas
    routers/           one file per resource (week, recipes, list, inbox, pantry, chat, store, settings, export, jobs)
    services/
      grocery.py       derive list, quantities, sections, diff
      planner.py       builds prompts, turns AI output into suggestions
      ads.py           store ad fetchers (wraps the logic in scripts/fetch_ads.py)
      instacart.py     products link client
      exporter.py      JSON, markdown and database export
    ai/
      client.py        CafeAI interface, ClaudeCafeAI, FakeCafeAI
      schemas.py       JSON schemas for every AI output
      prompts/         one prompt file per task
    jobs.py            queue, worker, job types
    scheduler.py       weekly prep
  migrations/
  tests/
frontend/
  src/ (api/, components/, screens/, sheets/, state/, styles/)
  public/ (fonts, manifest, icons)
deploy/
  cafe-lauren.service, install.sh, update.sh, backup.sh
scripts/
  import_notion.py     one-time import
```

## 4. Data model

All tables have `id`, `created_at`, `updated_at`. Weeks are keyed by their Monday date, so there is no archive step: an old week is just an older row.

| Table | Key fields |
|---|---|
| `people` | `key` (lauren, joe, leidy), `name`, `color`. Seeded. |
| `recipes` | `title`, `description`, `method`, `prep_min`, `cook_min`, `total_min`, `cost_usd`, `healthy`, `delicious`, `stars`, `tags[]`, `ingredients` (JSON: `[{qty, unit, name, group?}]`), `steps` (JSON: `[{group, steps[]}]`, quantities bold in markdown), `leftovers`, `source` (imported, ai, manual), `status` (draft, saved), `last_made`. |
| `weeks` | `monday` (unique date), `store_id`, `order_via`, `approved_by`, `approved_at`, `approved_list` (JSON snapshot). |
| `slots` | `week_id`, `day` (mon..sun), `kind` (cook, leftover, leidy, custom, open), `recipe_id?`, `text?`, `status` (suggested, thinking, kept, edited, approved, rejected), `by`, `basis`, `why[]`, `cook`, `ingredient_flags` (JSON: per ingredient `have` and `sale` note for this week). |
| `votes` | `slot_id`, `person`, `value` (up, down). Unique per slot and person. |
| `queue` | `recipe_id`, `by`. The "Up next" list. |
| `requests` | `who`, `type` (meal, out), `text`, `status` (new, planned, declined), `reply`, `week_id?`. |
| `pantry_photos` | `path`, `label`, `uploaded_by`, `read_at`. |
| `pantry_items` | `area`, `name`, `qty`, `state` (found, unsure, confirmed, removed), `note`, `photo_id?`, `added_by?`. |
| `staples` | `name`, `section`, `from?`, `active`. |
| `stores` | `key`, `name`, `ads_url`, `instacart_retailer_key?`. |
| `deals` | `store_id`, `valid_from`, `valid_to`, `item`, `price`, `unit`, `section`, `source_image`. |
| `list_adds` | `week_id`, `name`, `qty`, `section`, `note`, `from`. |
| `list_edits` | `week_id`, `item_key`, `qty?`, `name?`, `note?`, `removed`. |
| `list_checks` | `week_id`, `item_key`, `checked_by`. |
| `feedback` | `kind` (rejection, rating, preference), `recipe_id?`, `text`, `reasons[]`, `remember` (bool), `who`. |
| `cook_log` | `recipe_id`, `date`, `stars?`, `who`. |
| `chat_messages` | `who`, `from` (me, cafe), `text`, `proposal` (JSON: `{day, recipe_id?, text?, label, detail, state}`), `week_id`. |
| `jobs` | `type`, `status` (queued, running, done, failed, resting), `payload`, `result`, `error`, `requested_by`. |
| `settings` | key and value: prep day and time, default Leidy nights, model names, household size. |

Rules that the model must enforce:

- A recipe the AI invents is saved with `status = draft` and `source = ai`. It enters the recipe box only when a person taps "Save to recipe box". A draft that is on an approved week stays usable for that week.
- The grocery list is never stored. `services/grocery.py` derives it each time from: cook slots (their recipe ingredients minus those flagged `have`), active staples not confirmed in the pantry, `list_adds`, and `list_edits`. It returns the six sections from `CLAUDE.md`, in order, with no catch-all section.
- When a week is approved, the derived list is saved to `weeks.approved_list`. The diff shown afterwards is the current derived list compared with that snapshot. "Confirm" replaces the snapshot.
- Quantities with the same unit are summed. Different units are shown joined with "+" (as `addQty` does in `store.jsx`).
- A swap or a move clears that slot's votes, except the acting person's up vote.

## 5. API contract

Every request carries `X-Cafe-User: lauren|joe|leidy`. All AI work returns a job id at once; the result arrives through the job. Write this contract as `backend/cafe/schemas.py` first, and generate `frontend/src/api/types.ts` from the OpenAPI document, so both sides build against the same types.

| Area | Endpoints |
|---|---|
| Bootstrap | `GET /api/state` returns people, the current week with slots and votes, queue, request counts, pantry status, list diff count, and running jobs. This drives Home. |
| Week | `GET /api/weeks/{monday}`, `POST /api/weeks/{monday}/plan` (job), `POST .../approve` |
| Slots | `POST /api/slots/{id}/keep`, `/vote`, `/swap` (to a recipe, text, leftover, leidy or open), `/swap-options` (job; prefs and free text in, 3 options out), `/reject` (reasons, note, remember, mode: open or another; "another" starts a job), `/move`, `/cook` |
| Recipes | `GET /api/recipes` (search, filters), `GET/PATCH/DELETE /api/recipes/{id}`, `POST /api/recipes/draft` (job; describe, link, photo or pasted text), `POST /api/recipes/{id}/save`, `POST /api/recipes/{id}/cooked` (stars) |
| Queue | `GET/POST/DELETE /api/queue` |
| List | `GET /api/weeks/{monday}/list` (sections, items, diff), `POST .../list/items` (free text such as "2 lbs apples", parsed and filed into a section), `PATCH/DELETE .../list/items/{key}`, `POST .../list/items/{key}/check`, `POST .../list/confirm-diff`, `GET .../list/text` (plain text with ☐) |
| Ordering | `POST /api/weeks/{monday}/instacart-link` returns `{url}` |
| Inbox | `GET/POST /api/requests`, `POST /api/requests/{id}/answer` |
| Pantry | `POST /api/pantry/photos` (multipart), `GET /api/pantry`, `POST /api/pantry/read` (job), `PATCH /api/pantry/items/{id}`, `POST /api/pantry/items`, `POST /api/pantry/confirm` |
| Store | `GET /api/stores`, `PUT /api/weeks/{monday}/store`, `PUT .../order-via`, `POST /api/stores/{id}/ads/refresh` (job), `POST /api/stores/{id}/ads/upload` (manual ad photos), `GET /api/deals` |
| Chat | `GET /api/chat`, `POST /api/chat` (job; reply plus optional proposal), `POST /api/chat/{id}/proposal` (apply or dismiss) |
| Jobs | `GET /api/jobs/{id}`, `GET /api/jobs/stream` (server-sent events) |
| Settings | `GET/PUT /api/settings`, `GET /api/health` (database, Claude token, Instacart key, last prep run) |
| Export | `GET /api/export/all.json`, `/recipes.zip` (one markdown file per recipe in the `CLAUDE.md` format), `/database` (a consistent SQLite copy), `/weeks/{monday}.md` |

## 6. AI layer

All Claude calls go through one interface in `backend/cafe/ai/client.py`:

```python
class CafeAI(Protocol):
    async def plan_week(self, ctx: PlanContext) -> PlanSuggestion: ...
    async def swap_options(self, ctx: SwapContext) -> list[MealSuggestion]: ...
    async def replacement(self, ctx: RejectContext) -> MealSuggestion: ...
    async def read_pantry(self, photos: list[Path]) -> list[PantryRead]: ...
    async def read_ads(self, images: list[Path]) -> list[Deal]: ...
    async def draft_recipe(self, src: RecipeSource) -> RecipeDraft: ...
    async def chat(self, ctx: ChatContext) -> ChatReply: ...
```

- `ClaudeCafeAI` implements it with the Claude Agent SDK. `FakeCafeAI` returns fixtures built from `ui_kits/mobile/data.js`. Tests and frontend development use the fake, so they spend no subscription quota. `CAFE_AI=fake|claude` selects one.
- **Auth:** the owner runs `claude setup-token` once and puts the result in `.env` as `CLAUDE_CODE_OAUTH_TOKEN`. The token lasts one year and does not refresh. `ANTHROPIC_API_KEY` must be unset, because it takes precedence over the subscription token. `/api/health` reports a missing or rejected token.
- **Lockdown:** every call sets an explicit system prompt, no project settings, a small `max_turns`, and no tools. The one exception is image reading if Phase 0 finds that the `Read` tool is the working route; in that case allow only `Read`, with the working directory set to the media folder.
- **Structured output:** every method has a JSON schema in `ai/schemas.py`. The service validates the result with Pydantic and retries once on a validation failure.
- **Never write AI output to live state.** `planner.py` turns results into slots with `status = suggested`, pantry items with `state = found|unsure`, draft recipes, or chat proposals with `state = pending`.
- **Prompt context for planning:** the constraints from `CLAUDE.md`, current deals, confirmed pantry, open requests, the queue, the recipe box (title, stars, last made), the last four weeks of meals, and every `feedback` row with `remember = true`. Each suggestion must return `why[]`, per-ingredient `have` and `sale` flags, and either an existing `recipe_id` or a full new recipe.
- **Models:** default `claude-sonnet-5-5` for everything, set per task in `settings`.
- **Limits:** the worker runs one AI job at a time. When the subscription limit is hit, the job is marked `resting` and the UI shows "Café is resting. Try again later." Jobs that fail for other reasons are marked `failed` with the error text and a retry button.

The agent that researched the SDK could not confirm several details from current documentation. Phase 0 must settle them before anything else depends on them:

1. The exact option name and shape for structured output in the Python SDK, and where the parsed result appears on the result message.
2. Whether images are best passed as base64 content blocks in streaming input, or by letting the model use `Read` on a file path.
3. How a subscription limit surfaces to the caller (exception type or message fields).
4. Cold-start time per call on the Pi, and whether a long-lived `ClaudeSDKClient` is worth it over one-shot `query()` calls.

There is also a terms question the owner should know about. The Agent SDK documentation says Anthropic does not allow third-party developers to offer claude.ai login or rate limits in their products without approval. A private app for one's own household is not obviously what that sentence targets, but the documentation does not say so explicitly. Keeping `CafeAI` as one interface means the app can move to an API key by changing one environment variable.

## 7. Instacart

Use the Instacart Developer Platform "create shopping list page" endpoint.

- `POST {INSTACART_BASE}/idp/v1/products/products_link`, header `Authorization: Bearer $INSTACART_API_KEY`.
- Development host `https://connect.dev.instacart.tools`, production host `https://connect.instacart.com`.
- Body: `title`, `link_type: "shopping_list"`, `expires_in`, `line_items[]` with `name`, `quantity`, `unit`, `display_text`.
- The response contains `products_link_url`. Append `?retailer_key=<key>` to open a chosen store.
- Send unchecked items only. Cache the URL against a hash of the items, so repeated taps do not create new links.
- Map units to the ones Instacart accepts. Fall back to `each` and put the original amount in `display_text`.

What the family gets: one tap on "Open in Instacart" lands on an Instacart page with every item already matched to products, where they add to the cart and check out. The platform does not write to a cart directly.

Unknowns to resolve in Phase 0:

- Whether links from the development host open the real marketplace with a usable cart. If they do not, the owner must apply for a production key, which goes through a review that reportedly takes several weeks.
- The retailer keys for Cermak Produce and Aldi.

If no key is configured, the List screen falls back to Copy and "Send the list", and the Instacart options are shown as "Not set up yet".

## 8. Phases

Phases 2, 3 and 4 can run in parallel once Phase 1 has published the API types. Each phase ends with its tests passing and a commit on a feature branch.

### Phase 0: spikes (one agent, short)

Throwaway scripts in `spikes/`. Results recorded in `docs/SPIKE_RESULTS.md`.

- Call Claude through the Agent SDK with the subscription token: one structured-output call, one image call using a photo in `images/pantry/`. Record the working option names, the result fields, and timings.
- Force or simulate a limit error and record how it surfaces.
- Call the Instacart development host with a three-item list. Record whether the link is usable and which retailer keys work.
- Run `scripts/fetch_ads.py` and confirm the Cermak scraper still finds images.

Done when: the four unknowns in section 6 and the two in section 7 each have a written answer. If the Instacart key is not available yet, record that and continue; Phase 5 handles the fallback.

### Phase 1: backend core (one agent)

- Project scaffold, config, database, models, first Alembic migration, seed data (people, stores, settings).
- `schemas.py` and all routers that need no AI: state, week, slots (keep, vote, swap to a known recipe, move, cook, approve), recipes, queue, requests, pantry items, list, settings, health.
- `services/grocery.py`: derivation, quantity summing, section assignment, free-text item parsing, approval snapshot and diff.
- `jobs.py` with the worker and server-sent events, tested with a dummy job type.
- Export the OpenAPI document and generate `frontend/src/api/types.ts`.

Done when: pytest covers every action in `store.jsx` that does not need AI, including vote reset on swap, the diff after approval, and the rule that all list items fall into one of the six sections.

### Phase 2: AI layer (one agent, after Phase 0 and 1)

- `ai/schemas.py`, prompts, `FakeCafeAI`, `ClaudeCafeAI`.
- Job types: plan week, swap options, replacement after rejection, read pantry, read ads, draft recipe, chat.
- `planner.py` assembles context and converts results into suggestions.
- `ads.py` moves the logic of `scripts/fetch_ads.py` behind a per-store interface, and adds manual ad upload for stores with no scraper.
- `scheduler.py` runs weekly prep at the configured day and time: refresh ads, read deals, create next week if missing, draft the plan. It skips slots a person has already touched.

Done when: with `CAFE_AI=fake` the full loop runs in tests from empty week to approved week. With `CAFE_AI=claude`, a manual script produces a real plan, a real pantry read from `images/pantry/`, and a real deals read from `images/ads/`, all stored as suggestions.

### Phase 3: frontend foundation (one agent, after Phase 1)

- Vite project, tokens and fonts copied from the handoff unchanged, web manifest, home-screen icons.
- Port `components/` to TypeScript, using each `.d.ts` and `.prompt.md` as the specification.
- App shell: tab bar, back stack, sheet and toast hosts, the "who are you" picker (stored in `localStorage`), the Ask Café button.
- API client, TanStack Query setup, job stream subscription that invalidates queries when a job finishes.

Done when: the shell runs against the backend with `CAFE_AI=fake`, switches tabs, and shows the picker on first load.

### Phase 4: frontend screens (two agents in parallel, after Phase 3)

- **Agent A:** Home A, Plan A, the Swap, Reject and Change sheets, Meal detail with ingredient editing and cook mode, Ask Café chat with proposal cards.
- **Agent B:** Inbox (requests, pantry upload and review), Recipes and the Add a recipe sheet, List (quick add, edit, check, diff, copy), Store and ordering sheet, Send the list sheet, Settings with export buttons.

Match the prototype screens for layout, copy and spacing. Every suggested item must show the dashed `SuggestedTag` treatment and its "why". Loading states use the `thinking` status from the prototype.

Done when: every action in `store.jsx` except ordering and tracking works against the real API, and a walk-through on a phone-sized viewport (402 wide) matches the prototype.

### Phase 5: Instacart and export (one agent, after Phase 1)

- `services/instacart.py` and its endpoint, with the caching and fallback rules in section 7.
- `services/exporter.py` and its endpoints.
- The List screen call to action for each ordering method. Amazon options are shown as not available.

Done when: tests cover link creation with a mocked Instacart response, and each export downloads and re-parses.

### Phase 6: Notion import (one agent, after Phase 1)

- `scripts/import_notion.py` reuses the read functions in `scripts/notion_helpers.py`. It imports every Menu database entry (title, stars, ingredients, page body as steps) into `recipes` with `source = imported`, and the Staples entry into `staples`.
- It parses `data/archive/*/menu.md` and `data/current_week/menu.md` into past weeks on a best-effort basis, so "had it recently" works from day one.
- It is safe to run twice and prints a summary of what it imported and what it could not parse.

Done when: the owner has run it once against the real Notion workspace and reviewed the summary. Running it needs the owner's Notion token in `.env`; ask the owner to run it rather than running it unattended.

### Phase 7: deployment on the Pi (one agent, with the owner)

- `deploy/install.sh`: system packages, Python virtual environment, Node for the frontend build, Claude Code native installer, database migration, frontend build, systemd unit.
- `deploy/cafe-lauren.service`: runs as a non-root user, reads `.env`, restarts on failure, binds to the LAN on port 8080.
- `deploy/update.sh`: pull, install, migrate, build, restart.
- `deploy/backup.sh` plus a timer: nightly SQLite backup and media copy, keeping 14 days.
- mDNS name so the phones can open `http://cafe.local:8080`.
- `README.md` section: first-time setup, adding the app to the home screen, renewing the Claude token each year.

Done when: all three phones open the app on home Wi-Fi, a scheduled prep has run once, and a reboot brings the service back.

### Phase 8: cleanup (one agent)

- Remove the Notion runtime code, the Notion keys from `.env.example`, and the four slash commands, once the owner confirms the import is good.
- Rewrite `CLAUDE.md` to describe the app. Keep the meal constraints, recipe format and grocery sections, since the prompts quote them.
- Move `design_handoff_cafe_lauren_app/` to `.claude/skills/cafe-lauren-design/` as its `SKILL.md` suggests, and remove the duplicate `Cafe Lauren Design System/` folder if the owner agrees.

### Phase 9: Kroger cart fill for Mariano's (one agent, last)

Do not start this until the owner has used the app from Phases 0 to 8 and asks for it. It adds the one thing the Instacart link cannot do: putting items straight into a cart. It only works for Mariano's, which is a Kroger store.

The details below came from search results, not from Kroger's documentation pages, which did not load during research. Check each one against `developer.kroger.com` before building.

- **Access:** the owner registers a free application at `developer.kroger.com` and adds `KROGER_CLIENT_ID` and `KROGER_CLIENT_SECRET` to `.env`.
- **Store:** add Mariano's to `stores`. Use the Locations API to find the family's store and save its location id in settings.
- **Sign-in:** OAuth2 authorization-code flow with the scope `cart.basic:write`. The owner signs in to their Kroger account once from Settings. Store the refresh token in the database and refresh it in the background. Check first whether Kroger accepts a plain `http://` redirect address on the home network. If it requires HTTPS, the sign-in step must run through a `localhost` redirect on the Pi or a laptop, and the plan for it needs the owner's input.
- **Matching:** for each unchecked list item, search the Products API at the saved location, then have Claude choose the best product. Add a `match_products` method to `CafeAI` that returns the chosen UPC, a `sure` flag and a note for each item. Save the results in a new `cart_matches` table (`week_id`, `item_key`, `upc`, `product`, `size`, `price`, `sure`, `note`, `state`: pending, confirmed, changed, skipped).
- **Review:** build the Order review screen from the prototype (`ListScreens.jsx → OrderReview`). Flagged matches come first with "Change" and "Looks right". "Add to Mariano's cart" stays disabled until every flagged match is resolved. This is the approval rule from the design system: uncertain reads block ordering.
- **Cart:** `PUT /v1/cart/add` with `items[{upc, quantity, modality}]`, where modality is `PICKUP` or `DELIVERY`. The public API can add to the cart but cannot read it, so the app records what it sent and marks those items as "in cart" itself. Sending twice would add twice; guard against that.
- **Checkout:** the app never checks out. After the cart is filled, the button opens the Mariano's cart page for the owner to review and pay.
- **Out of scope here:** delivery tracking and live substitutions. The public API does not expose them.

Done when: tests cover matching, the review gate and the add-to-cart call against mocked Kroger responses, and the owner has filled a real Mariano's cart from an approved week and confirmed the items are right.

## 9. What the owner must do

The agents cannot do these. Only the first one blocks the start of the build.

1. **Done.** Run `claude setup-token` and put the token in `.env` as `CLAUDE_CODE_OAUTH_TOKEN`.
2. Create an Instacart Developer Platform account and a development key. Add it as `INSTACART_API_KEY`. Apply for a production key if the spike shows development links are not usable. Needed to finish Phase 5; until then the Instacart button shows "Not set up yet" and Copy and Send work.
3. Set up the Pi with 64-bit Raspberry Pi OS, SSH access, and a fixed address on the home network. Needed for Phase 7 only.
4. Run the Notion import once and check the result. Needed to finish Phase 6.
5. Decide whether to keep the old slash commands until the app has run for a few weeks. Needed for Phase 8.
6. Register a Kroger developer application. Needed for Phase 9 only.

### Building before the rest is ready

Phases 0 to 6 are built and run on the Mac in this repository. The app runs locally with `uvicorn` and the Vite dev server, and the phones can reach the Mac on home Wi-Fi for testing.

- **Phase 0:** run the Claude spikes and the ad-fetch check. Skip the Instacart spike if there is no key, and record it as pending in `docs/SPIKE_RESULTS.md`.
- **Phase 5:** build the Instacart client against mocked responses and the documented request shape. Run the pending spike when the key arrives, then set the retailer keys.
- **Phase 6:** build and test the import against saved sample responses. The owner runs it against the real workspace; the Notion token is already in `.env`.
- **Phases 7 to 9:** wait for the owner.

## 10. Risks

| Risk | Handling |
|---|---|
| Subscription terms for a self-hosted app are not explicit | Raised in section 6. One environment variable switches to an API key. |
| Subscription limits are shared with the owner's other Claude use | One job at a time, a "resting" state, and scheduled prep in the early morning. |
| Instacart production key is refused or slow | Development key if usable; otherwise Copy and Send remain the ordering path. |
| The Cermak ad page changes | Manual ad photo upload works for any store. |
| Plain HTTP limits browser features | Clipboard fallback; no offline mode. Local HTTPS can be added later without changing the app. |
| The SD card fails | Nightly backups; the database export endpoint. |
