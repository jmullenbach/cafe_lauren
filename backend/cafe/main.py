"""App factory: `uvicorn cafe.main:create_app --factory --port 8080`."""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from .ai import handlers as _ai_handlers  # noqa: F401  (registers the AI job handlers)
from .config import Settings, get_settings
from .db import Database, run_migrations
from .jobs import JobManager
from .scheduler import PrepScheduler
from .routers import export as export_router, ordering
from .routers import chat, core, grocery_list, inbox, jobs, pantry, recipes, slots, stores, weeks


class SPAStaticFiles(StaticFiles):
    """Serve the PWA build; unknown non-API paths fall back to index.html."""

    async def get_response(self, path, scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as e:
            if e.status_code == 404 and not path.startswith(("api/", "media/")):
                return await super().get_response("index.html", scope)
            raise


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    if settings.cafe_run_migrations:
        run_migrations(settings.cafe_db_path)
    settings.cafe_media_dir.mkdir(parents=True, exist_ok=True)
    db = Database(settings)
    manager = JobManager(db)
    prep = PrepScheduler(db, manager)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if settings.cafe_start_worker:
            await manager.start()
        if settings.cafe_start_scheduler:
            prep.start()
        try:
            yield
        finally:
            prep.stop()
            await manager.stop()
            db.dispose()

    app = FastAPI(title="Café Lauren", version="0.1.0", lifespan=lifespan)
    app.state.settings = settings
    app.state.db = db
    app.state.jobs = manager
    app.state.scheduler = prep

    for r in (core.router, weeks.router, slots.router, recipes.router, inbox.queue_router,
              inbox.requests_router, pantry.router, grocery_list.router,
              stores.router, chat.router, jobs.router, ordering.router, export_router.router):
        app.include_router(r)

    app.mount("/media", StaticFiles(directory=settings.cafe_media_dir), name="media")
    dist: Path = settings.cafe_frontend_dist
    if (dist / "index.html").exists():
        app.mount("/", SPAStaticFiles(directory=dist, html=True), name="frontend")
    return app
