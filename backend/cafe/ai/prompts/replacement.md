## Task: suggest a replacement after a rejection

A person turned down `rejected` for `day`. Their reasons are in `reasons` and `reject_note`. Suggest one different meal for that night that answers those reasons. Do not suggest the rejected meal, or anything close to it. Answer fast and keep it short.

- Prefer the recipe box: set `recipe_id` and leave `idea` null.
- If nothing fits, set `recipe_id` null and fill `idea` with only the title, short title, one-sentence description, method, total minutes and cost for 5. Do not write ingredients lists or steps; the full recipe is written afterwards.
- Start `why` with what they said, e.g. "You said: Too much work", then 1-2 more reasons.
- `ingredients`: only the 3-6 main items, each with `have` and `sale`.
