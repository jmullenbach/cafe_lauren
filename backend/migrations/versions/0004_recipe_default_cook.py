"""recipe default_cook

Who usually cooks a recipe (a person key). Carried to the slot when the recipe is planned.

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-04 09:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0004'
down_revision = '0003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('recipes') as b:
        b.add_column(sa.Column('default_cook', sa.String(length=20), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('recipes') as b:
        b.drop_column('default_cook')
