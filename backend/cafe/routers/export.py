from __future__ import annotations

from datetime import date

from fastapi import APIRouter, BackgroundTasks, Response
from fastapi.responses import FileResponse

from ..deps import DB, AppSettingsDep, User
from ..services import exporter
from ..services import weeks as W

router = APIRouter(prefix="/api/export", tags=["export"])


def _cd(name: str) -> dict[str, str]:
    return {"Content-Disposition": f'attachment; filename="{name}"'}


@router.get("/all.json", operation_id="exportAllJson")
def export_all(db: DB, who: User, cfg: AppSettingsDep) -> Response:
    import json
    body = json.dumps(exporter.dump_all(db), ensure_ascii=False, indent=1)
    return Response(body, media_type="application/json",
                    headers=_cd(f"cafe-lauren-{W.today(cfg.cafe_timezone).isoformat()}.json"))


@router.get("/recipes.zip", operation_id="exportRecipesZip")
def export_recipes(db: DB, who: User, cfg: AppSettingsDep) -> Response:
    return Response(exporter.recipes_zip(db), media_type="application/zip",
                    headers=_cd(f"cafe-lauren-recipes-{W.today(cfg.cafe_timezone).isoformat()}.zip"))


@router.get("/database", operation_id="exportDatabase")
def export_database(who: User, cfg: AppSettingsDep, bg: BackgroundTasks) -> FileResponse:
    path = exporter.database_copy(cfg.cafe_db_path)
    bg.add_task(path.unlink, missing_ok=True)
    return FileResponse(path, media_type="application/octet-stream",
                        filename=f"cafe-lauren-{W.today(cfg.cafe_timezone).isoformat()}.db")


@router.get("/weeks/{monday}.md", operation_id="exportWeekMarkdown")
def export_week(monday: date, db: DB, who: User) -> Response:
    week = W.get_or_create_week(db, monday)
    return Response(exporter.week_markdown(db, week), media_type="text/markdown; charset=utf-8",
                    headers=_cd(f"cafe-lauren-week-{monday.isoformat()}.md"))
