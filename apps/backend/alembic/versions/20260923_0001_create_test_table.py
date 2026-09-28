"""create test table

Revision ID: 20260923_0001
Revises:
Create Date: 2026-09-23
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260923_0001"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "test_table",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("item", sa.String(length=255), nullable=False, unique=True),
        sa.Column("time_added", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    test_table = sa.table(
        "test_table",
        sa.column("item", sa.String()),
    )
    op.bulk_insert(
        test_table,
        [
            {"item": "apple"},
            {"item": "banana"},
            {"item": "carrot"},
        ],
    )


def downgrade() -> None:
    op.drop_table("test_table")