from __future__ import annotations

from datetime import date
from typing import Literal

from typing import Annotated

from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from sqlalchemy import select

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, Jobs, User
from ..services import media
from ..services import weeks as W

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


def _get(db, recipe_id: int) -> m.Recipe:
    r = db.get(m.Recipe, recipe_id)
    if r is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return r


def _detail(db, r: m.Recipe, tz: str) -> s.RecipeDetail:
    week = W.current_week(db, tz)
    days = [sl.day for sl in week.slots if sl.recipe_id == r.id]
    in_queue = db.scalar(select(m.QueueEntry.id).where(m.QueueEntry.recipe_id == r.id)) is not None
    logs = db.scalars(select(m.CookLog).where(m.CookLog.recipe_id == r.id).order_by(m.CookLog.date.desc())).all()
    return s.RecipeDetail.model_validate({**W.recipe_out(r), "on_week_days": days, "in_queue": in_queue,
                                          "ratings": [s.CookLogEntry.model_validate(x) for x in logs]})


@router.get("", response_model=list[s.RecipeSummary], operation_id="listRecipes")
def list_recipes(
    db: DB,
    who: User,
    q: str | None = Query(default=None, description="Search title, description and ingredients"),
    filter: str | None = Query(default=None, description='Chip: "All", "5 stars", or a tag such as "Quick"'),
    tag: list[str] = Query(default=[]),
    method: str | None = None,
    min_stars: int | None = Query(default=None, ge=0, le=5),
    status: Literal["saved", "draft", "all"] = "saved",
    sort: Literal["title", "stars", "last_made", "recent"] = "stars",
) -> list[s.RecipeSummary]:
    stmt = select(m.Recipe)
    if status != "all":
        stmt = stmt.where(m.Recipe.status == status)
    if method:
        stmt = stmt.where(m.Recipe.method == method)
    if min_stars is not None:
        stmt = stmt.where(m.Recipe.stars >= min_stars)
    rows = list(db.scalars(stmt))
    if q and q.strip():
        ql = q.strip().lower()
        rows = [r for r in rows if ql in r.title.lower() or ql in (r.description or "").lower()
                or ql in (r.short_title or "").lower()
                or any(ql in str(i.get("name", "")).lower() for i in r.ingredients or [])]
    tags = list(tag)
    if filter and filter != "All":
        if filter == "5 stars":
            rows = [r for r in rows if (r.stars or 0) == 5]
        else:
            tags.append(filter)
    for t in tags:
        rows = [r for r in rows if t in (r.tags or [])]
    if sort == "title":
        rows.sort(key=lambda r: r.title.lower())
    elif sort == "last_made":
        rows.sort(key=lambda r: r.last_made or date.min, reverse=True)
    elif sort == "recent":
        rows.sort(key=lambda r: r.created_at, reverse=True)
    else:
        rows.sort(key=lambda r: (-(r.stars or 0), r.title.lower()))
    return [s.RecipeSummary.model_validate(r) for r in rows]


@router.post("", response_model=s.RecipeDetail, status_code=201, operation_id="createRecipe")
def create_recipe(body: s.RecipeCreate, db: DB, who: User, cfg: AppSettingsDep) -> s.RecipeDetail:
    data = body.model_dump()
    r = m.Recipe(**data, source="manual", status="saved")
    db.add(r)
    db.flush()
    return _detail(db, r, cfg.cafe_timezone)


@router.post("/draft", response_model=s.JobAccepted, status_code=202, operation_id="draftRecipe")
def draft_recipe(body: s.RecipeDraftRequest, db: DB, who: User, jobs: Jobs) -> s.JobAccepted:
    job = jobs.enqueue(db, J.RECIPE_DRAFT, body.model_dump(), who)
    return s.JobAccepted(job=s.Job.model_validate(job))


@router.post("/photos", response_model=s.RecipePhotoOut, status_code=201, operation_id="uploadRecipePhoto")
async def upload_recipe_photo(who: User, cfg: AppSettingsDep, file: Annotated[UploadFile, File(description="A recipe card or cookbook page")]) -> s.RecipePhotoOut:
    rel = await media.save_upload(cfg.cafe_media_dir, "recipes", file)
    return s.RecipePhotoOut(path=rel)


@router.get("/{recipe_id}", response_model=s.RecipeDetail, operation_id="getRecipe")
def get_recipe(recipe_id: int, db: DB, who: User, cfg: AppSettingsDep) -> s.RecipeDetail:
    return _detail(db, _get(db, recipe_id), cfg.cafe_timezone)


@router.patch("/{recipe_id}", response_model=s.RecipeDetail, operation_id="patchRecipe")
def patch_recipe(recipe_id: int, body: s.RecipePatch, db: DB, who: User, cfg: AppSettingsDep) -> s.RecipeDetail:
    r = _get(db, recipe_id)
    if body.default_cook is not None and db.scalar(select(m.Person.id).where(m.Person.key == body.default_cook)) is None:
        raise HTTPException(status_code=422, detail=f"Unknown person: {body.default_cook}")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    return _detail(db, r, cfg.cafe_timezone)


@router.delete("/{recipe_id}", response_model=s.Ok, operation_id="deleteRecipe")
def delete_recipe(recipe_id: int, db: DB, who: User) -> s.Ok:
    r = _get(db, recipe_id)
    for sl in db.scalars(select(m.Slot).where(m.Slot.recipe_id == r.id)):
        sl.kind, sl.recipe_id, sl.status = ("open", None, None) if sl.kind == "cook" else (sl.kind, None, sl.status)
        if sl.kind == "open":
            sl.cook = None
    db.delete(r)
    return s.Ok()


@router.post("/{recipe_id}/save", response_model=s.RecipeDetail, operation_id="saveRecipe")
def save_recipe(recipe_id: int, db: DB, who: User, cfg: AppSettingsDep) -> s.RecipeDetail:
    r = _get(db, recipe_id)
    r.status = "saved"
    return _detail(db, r, cfg.cafe_timezone)


@router.post("/{recipe_id}/cooked", response_model=s.CookedResponse, operation_id="markCooked")
def cooked(recipe_id: int, body: s.CookedRequest, db: DB, who: User, cfg: AppSettingsDep) -> s.CookedResponse:
    r = _get(db, recipe_id)
    on = body.date or W.today(cfg.cafe_timezone)
    log = m.CookLog(recipe_id=r.id, date=on, stars=body.stars, who=who)
    db.add(log)
    if r.last_made is None or on > r.last_made:
        r.last_made = on
    if body.stars is not None:
        db.add(m.Feedback(kind="rating", recipe_id=r.id, text=body.note, reasons=[f"{body.stars} stars"],
                          remember=True, who=who))
        if r.stars is None or r.stars == 0:
            r.stars = body.stars
    db.flush()
    return s.CookedResponse(recipe=s.Recipe.model_validate(r), log=s.CookLogEntry.model_validate(log))
