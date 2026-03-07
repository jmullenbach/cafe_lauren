# Notion Page Structure: Grocery List

**Page ID:** `$NOTION_GROCERY_PAGE_ID` (from `.env`)
**Title:** Grocery List

## Page Layout

The page has two sections of to-do items followed by an inline Menu database:

### Section 1: "To Buy:"
- **Block ID:** `$NOTION_TO_BUY_BLOCK_ID` (from `.env`)
- **Type:** paragraph (plain text header, not a heading block)
- Contains recipe-specific ingredients as `to_do` blocks
- Ingredient format: **bold quantity** + regular text description
  - Example: `**1.25 lbs** large shrimp, peeled and deveined`
- All items are unchecked (ready to buy)

### Section 2: "Staples:"
- **Block ID:** `$NOTION_STAPLES_BLOCK_ID` (from `.env`)
- **Type:** paragraph with bold text ("**Staples**:")
- Contains general household grocery items as `to_do` blocks
- Simple text without quantities (e.g., "Eggs", "Milk", "Bananas")
- These are recurring items the family always needs

### Section 3: Menu Database (inline)
- **Database ID:** `$NOTION_MENU_DB_ID` (from `.env`)
- **Type:** `child_database` block
- Inline database embedded in the page

---

## Menu Database Schema

| Property | Type | Description |
|----------|------|-------------|
| **Title** | title | Meal name (e.g., "Thai Coconut Shrimp Curry") |
| **Tags** | select | Day assignment / category |
| **Stars** | number | Rating (user favorites get 5 stars) |
| **Ingredients** | rich_text | Ingredient list with checkboxes and bold formatting |
| **Button** | button | UI action button (not used for data) |

### Tags Options (select values)
| Value | Color | Purpose |
|-------|-------|---------|
| 0. This Week | purple | Items selected for current week |
| 1. Monday | yellow | Monday's meal |
| 2. Tuesday | green | Tuesday's meal |
| 3. Wednesday | pink | Wednesday's meal |
| 4. Thursday | gray | Thursday's meal |
| 5. Friday | red | Friday's meal |
| 6. Saturday | default | Saturday's meal |
| 7. Sunday | orange | Sunday's meal |
| 8. Spare | brown | Backup meals |

### Ingredients Field Format
Rich text with mixed formatting:
- Bold headers: "**Ingredients:**"
- Bullet points with checkboxes: "• [ ] 2 lbs chicken thighs"
- Some recipes use component sections: "**For the Chicken:**", "**For the Dressing:**"

### Recipe Detail Pages
Each menu entry is a Notion page that can contain child blocks (full recipe instructions). Access via `/blocks/{page_id}/children` endpoint.

---

## How to Update This Page

### Adding grocery items (to_do blocks)
```json
{
  "object": "block",
  "type": "to_do",
  "to_do": {
    "rich_text": [
      {"type": "text", "text": {"content": "2 lbs"}, "annotations": {"bold": true}},
      {"type": "text", "text": {"content": " chicken thighs"}}
    ],
    "checked": false
  }
}
```

### Adding menu entries (database pages)
Use `POST /v1/pages` with `parent: { database_id: "$NOTION_MENU_DB_ID" }` and properties for Title, Tags, Stars, Ingredients.

### Key Block IDs (all from `.env`)
- Page: `$NOTION_GROCERY_PAGE_ID`
- "To Buy:" header: `$NOTION_TO_BUY_BLOCK_ID`
- "Staples:" header: `$NOTION_STAPLES_BLOCK_ID`
- Menu database: `$NOTION_MENU_DB_ID`
