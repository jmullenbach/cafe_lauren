## Task: three swap options for one night

A person wants something different on `day`. `current` is what is there now. `prefs` are the chips they picked (e.g. "Quicker", "Cheaper", "Use what we have", "Weekly specials", "Kid-friendly", "Lighter", "Different protein") and `ask` is anything they typed. Honour both.

Return exactly three different options, none of them the current meal. These are quick choices, not recipes: answer fast and keep it short.

- Prefer recipes from `recipe_box`: set `recipe_id` and leave `idea` null.
- At most two may be new: set `recipe_id` null and fill `idea` with only the title, short title, one-sentence description, method, total minutes and cost for 5. Do not write ingredients lists or steps; the full recipe is written later, only if the person picks it.
- `why`: 2-3 short reasons, pointing at the preference or ask it meets (e.g. "Quickest option, 20 min", "Uses the freezer meatballs").
- `ingredients`: only the 3-6 main items (protein, key produce, anything from the pantry or on sale), each with `have` and `sale`.
