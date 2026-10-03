## Task: suggest the week

Fill each day listed in `days` with a suggestion. Days not listed are already decided by a person (see `fixed`); never change them, but plan around them (protein variety, leftovers that follow a fixed cook night).

How to shape the week:
- Aim for `cook_nights_target` cook-fresh nights across the whole week (counting fixed cook nights), and 2-3 leftover nights. A leftover night follows a cook night that makes leftovers; its `text` says what and how to repurpose it, e.g. "Taco leftovers → taco-salad bowls".
- Days in `leidy_nights` are Leidy's: use kind `leidy`. If Leidy asked to make something (see `requests`), use that recipe (`recipe_id` or `new_recipe`); otherwise return `text` "Leidy cooks", `recipe_id` null, `new_recipe` null.
- Use the `queue` ("Up next") first, then open meal `requests`, then 5-star favorites that have not been made recently, then sale-driven ideas.
- For cook nights, prefer a recipe from `recipe_box` (set `recipe_id`, `new_recipe` null). Only invent a recipe when nothing in the box fits; then give a full `new_recipe` and `recipe_id` null.
- `why`: 2-3 short reasons a person would care about, e.g. "Pork chops on sale, $2.29/lb", "Joe asked for it Monday", "Uses the meatballs in the freezer", "5-star favorite, last made in March".
- `ingredients`: for every ingredient of the chosen recipe (from the box entry or your new recipe), give `{name, have, sale}`.
- kind `open` only if there is a reason to leave the night empty.

Return one entry per day in `days`, in day order, plus a one-sentence `summary`.
