"""Engine, sessions and migrations."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from .config import BACKEND_DIR, Settings, get_settings


def make_engine(db_path: Path) -> Engine:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False, "timeout": 30},
    )

    @event.listens_for(engine, "connect")
    def _pragmas(dbapi_conn, _record):  # pragma: no cover - trivial
        cur = dbapi_conn.cursor()
        cur.execute("PRAGMA foreign_keys=ON")
        cur.execute("PRAGMA journal_mode=WAL")
        cur.execute("PRAGMA busy_timeout=30000")
        cur.close()

    return engine


class Database:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.engine = make_engine(settings.cafe_db_path)
        self.SessionLocal = sessionmaker(bind=self.engine, expire_on_commit=False)

    @contextmanager
    def session(self) -> Iterator[Session]:
        s = self.SessionLocal()
        try:
            yield s
            s.commit()
        except Exception:
            s.rollback()
            raise
        finally:
            s.close()

    def dispose(self) -> None:
        self.engine.dispose()


def alembic_config(db_path: Path):
    from alembic.config import Config

    cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND_DIR / "migrations"))
    cfg.set_main_option("sqlalchemy.url", f"sqlite:///{db_path}")
    return cfg


BACKUPS_KEPT = 10


def backup_before_migrating(db_path: Path) -> Path | None:
    """Copy the database into `backups/` beside it when a migration is about to change it.

    Returns the copy's path, or None when there is no database yet or it is already at head."""
    import sqlite3
    from datetime import datetime

    from alembic.runtime.migration import MigrationContext
    from alembic.script import ScriptDirectory

    if not db_path.exists():
        return None
    engine = create_engine(f"sqlite:///{db_path}")
    try:
        with engine.connect() as conn:
            current = MigrationContext.configure(conn).get_current_revision()
    finally:
        engine.dispose()
    if current == ScriptDirectory.from_config(alembic_config(db_path)).get_current_head():
        return None
    folder = db_path.parent / "backups"
    folder.mkdir(parents=True, exist_ok=True)
    out = folder / f"{db_path.stem}-{current or 'new'}-{datetime.now():%Y%m%d-%H%M%S}.db"
    src, dst = sqlite3.connect(db_path), sqlite3.connect(out)
    try:
        src.backup(dst)  # consistent even with a write-ahead log
    finally:
        dst.close()
        src.close()
    for old in sorted(folder.glob(f"{db_path.stem}-*.db"))[:-BACKUPS_KEPT]:
        old.unlink()
    return out


def run_migrations(db_path: Path) -> None:
    from alembic import command

    db_path.parent.mkdir(parents=True, exist_ok=True)
    backup_before_migrating(db_path)
    command.upgrade(alembic_config(db_path), "head")


def migrate_cli() -> None:
    """`uv run cafe-migrate`: upgrade the configured database to head."""
    s = get_settings()
    run_migrations(s.cafe_db_path)
    print(f"Migrated {s.cafe_db_path}")
