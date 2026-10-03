"""slot job_id

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-03 15:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('slots') as b:
        b.add_column(sa.Column('job_id', sa.Integer(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('slots') as b:
        b.drop_column('job_id')
