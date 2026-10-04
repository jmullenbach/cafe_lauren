"""lunches and breakfast slot

Every week gets a catch-all "Lunches & breakfast" slot (day "extra"). The staples move
from the `staples` table into a recipe tagged "Staples", which that slot holds by default.
The `staples` table is left in place, unused.

Revision ID: 0005
Revises: 0004
Create Date: 2026-10-04 12:00:00.000000
"""
import json
from datetime import datetime, timezone

from alembic import op
import sqlalchemy as sa

revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None

TAG = "Staples"


def upgrade() -> None:
    bind = op.get_bind()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    ts = {"created_at": now, "updated_at": now}

    names = [r[0] for r in bind.execute(sa.text('SELECT name FROM staples WHERE active = 1 ORDER BY id'))]
    row = bind.execute(sa.text("SELECT id, tags FROM recipes WHERE lower(title) = 'staples' ORDER BY id LIMIT 1")).first()
    recipe_id = None
    if row is not None:
        recipe_id = row[0]
        tags = json.loads(row[1]) if isinstance(row[1], str) else list(row[1] or [])
        if TAG not in tags:
            bind.execute(sa.text("UPDATE recipes SET tags = :t WHERE id = :i"),
                         {"t": json.dumps([*tags, TAG]), "i": recipe_id})
    elif names:
        recipes = sa.table(
            "recipes", sa.column("title"), sa.column("short_title"), sa.column("description"),
            sa.column("tags", sa.JSON), sa.column("ingredients", sa.JSON), sa.column("steps", sa.JSON),
            sa.column("source"), sa.column("status"), sa.column("detail_status"),
            sa.column("created_at"), sa.column("updated_at"))
        op.bulk_insert(recipes, [{
            "title": "Staples", "short_title": "Staples",
            "description": "Breakfast, lunch and household basics we buy every week.",
            "tags": [TAG], "ingredients": [{"qty": "", "unit": "", "name": n, "group": None} for n in names],
            "steps": [], "source": "imported", "status": "saved", "detail_status": "complete", **ts}])
        recipe_id = bind.execute(sa.text("SELECT id FROM recipes WHERE title = 'Staples' ORDER BY id DESC LIMIT 1")).scalar()

    weeks = [r[0] for r in bind.execute(sa.text(
        "SELECT id FROM weeks WHERE id NOT IN (SELECT week_id FROM slots WHERE day = 'extra')"))]
    slots = sa.table(
        "slots", sa.column("week_id"), sa.column("day"), sa.column("kind"), sa.column("recipe_id"),
        sa.column("status"), sa.column("by"), sa.column("why", sa.JSON), sa.column("ingredient_flags", sa.JSON),
        sa.column("created_at"), sa.column("updated_at"))
    if weeks:
        op.bulk_insert(slots, [{
            "week_id": w, "day": "extra", "kind": "cook" if recipe_id else "open", "recipe_id": recipe_id,
            "status": "suggested" if recipe_id else None, "by": "cafe" if recipe_id else None,
            "why": [], "ingredient_flags": {}, **ts} for w in weeks])


def downgrade() -> None:
    op.execute("DELETE FROM slots WHERE day = 'extra'")
