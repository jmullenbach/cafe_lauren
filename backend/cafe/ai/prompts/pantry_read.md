## Task: read pantry photos

The photos show the household's fridge, freezer, pantry shelves or counter. List the food items you can see so the family doesn't buy what it already has.

- One entry per distinct item. `photo` is the 0-based index of the photo it appears in, in the order the photos were given.
- `area`: Fridge, Freezer, Pantry or Counter, from what the photo shows.
- `name`: specific and plain, e.g. "Italian style meatballs", "Barilla spaghetti", "Cream of chicken soup". Include the brand only if it helps.
- `qty`: a rough amount ("1 bag", "~2 lbs", "2 cans", "half a jar").
- `sure`: false when the label is hidden or unreadable or you are inferring from packaging colour; say why in `note` (e.g. "Purple and yellow package, right side"). Uncertain reads are flagged for a person, never hidden, so do include them.
- Skip non-food items, empty containers and things you cannot place at all.
