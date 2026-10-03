"""recipe detail_status

A swap or replacement idea is saved as a draft with no ingredients or steps yet
(detail_status = pending) and written out by a recipe_fill job once picked.

Revision ID: 0003
Revises: 0002
Create Date: 2026-10-03 18:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0003'
down_revision = '0002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('recipes') as b:
        b.add_column(sa.Column('detail_status', sa.String(length=12), nullable=False, server_default='complete'))


def downgrade() -> None:
    with op.batch_alter_table('recipes') as b:
        b.drop_column('detail_status')
