# Meal Ideas

Generate quick meal ideas based on what's available. This is a standalone command for mid-week inspiration — not the full weekly workflow.

## Instructions

1. Check if the user provided context with the command (e.g., "I have leftover chicken" or "something quick for tonight"). If not, check:
   - `data/current_week/pantry_inventory.md` for what's on hand
   - `data/current_week/deals.md` for current Cermak specials
   - `data/current_week/menu.md` for what's already planned this week (avoid repeats)

2. Generate 3-5 meal suggestions. Each should include:
   - **Title** and 1-sentence description
   - **Cooking method**: sheet pan, instant pot, Le Creuset, or skillet
   - **Total time**: prep + cook
   - **Key ingredients** needed (note which ones the user already has)
   - **Leftover friendly?**: Yes/No and why

3. Constraints to follow:
   - 5 people per meal
   - Large vegetable portions or sides
   - Include a protein (favorites: boneless chicken thighs, pork, taco meats, sausages)
   - Fast and simple — busy parent cooking methods
   - Prioritize ingredients already on hand

4. Ask the user which one they want, then provide the full recipe in the standard checkbox format with bold inline ingredients (see CLAUDE.md for format details).
