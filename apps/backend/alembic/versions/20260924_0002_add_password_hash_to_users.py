"""add password hash to users

Revision ID: 20260924_0002
Revises: 20260924_0001
Create Date: 2026-09-24
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260924_0002"
down_revision: str | Sequence[str] | None = "20260924_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("password_hash", sa.String(length=255), nullable=True))
    op.execute(
        sa.text(
            "UPDATE users SET password_hash = 'pbkdf2_sha256$placeholder$placeholder' WHERE password_hash IS NULL"
        )
    )
    op.alter_column("users", "password_hash", nullable=False)


def downgrade() -> None:
    op.drop_column("users", "password_hash")
