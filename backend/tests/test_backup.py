"""A copy of the database is kept before a migration changes it."""

import sqlite3

from alembic import command

from cafe import db as D


def test_backup_only_when_a_migration_is_pending(tmp_path):
    path = tmp_path / "cafe.db"
    assert D.backup_before_migrating(path) is None  # nothing to copy yet
    command.upgrade(D.alembic_config(path), "0004")
    with sqlite3.connect(path) as c:
        c.execute("INSERT INTO settings (key, value, created_at, updated_at) VALUES ('mine', ?, 'x', 'x')", ('"kept"',))
    D.run_migrations(path)
    copies = list((tmp_path / "backups").glob("cafe-0004-*.db"))
    assert len(copies) == 1
    with sqlite3.connect(copies[0]) as c:
        assert c.execute("SELECT value FROM settings WHERE key = 'mine'").fetchone() == ('"kept"',)
        assert c.execute("SELECT version_num FROM alembic_version").fetchone() == ("0004",)
    D.run_migrations(path)  # already at head: no second copy
    assert len(list((tmp_path / "backups").glob("*.db"))) == 1
