"""chat list changes

Grocery list changes Café proposes in a chat reply, each with its own state
(pending, applied, dismissed, missed). Nothing reaches the list until a person approves it.

Revision ID: 0006
Revises: 0005
Create Date: 2026-10-04 17:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0006'
down_revision = '0005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('chat_messages') as b:
        b.add_column(sa.Column('list_changes', sa.JSON(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('chat_messages') as b:
        b.drop_column('list_changes')
