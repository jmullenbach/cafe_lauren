## Task: three swap options for one night

A person wants something different on `day`. `current` is what is there now. `prefs` are the chips they picked (e.g. "Quicker", "Cheaper", "Use what we have", "Weekly specials", "Kid-friendly", "Lighter", "Different protein") and `ask` is anything they typed. Honour both.

Return exactly three different cook-night options (kind `cook`, `day` set to the requested day), none of them the current meal. Prefer recipes from `recipe_box` (`recipe_id`); invent at most two (`new_recipe` with a full recipe). Each needs `why` (point at the preference it meets, e.g. "Quickest option, 20 min") and `ingredients` flags.
