## Task: read the weekly grocery ad

The images are pages of a grocery store's weekly ad. List every food deal you can read.

- `item`: the product as printed, cleaned up ("Center Cut Pork Chops", "Goya Black Beans 29 oz").
- `price`: as printed: "$2.29", "2/$5", "10/$1", "$0.99". `unit`: "lb", "ea", "oz" or null.
- `section`: one of produce, frozen, meat, dry, dairy, beverages (deli and bakery are meat; snacks and canned goods are dry).
- `image`: 0-based index of the ad image the deal is on.
- `valid_from` / `valid_to`: the dates the ad runs, as YYYY-MM-DD, if printed (assume the current year when only month and day show). Null if not shown.
- Skip non-food items. Do not invent prices you cannot read.
