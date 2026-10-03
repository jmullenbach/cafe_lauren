from __future__ import annotations

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sqlalchemy import func, select

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, Jobs, User
from ..services import media
from ..services import weeks as W

router = APIRouter(prefix="/api/pantry", tags=["pantry"])

AREAS = ["Fridge", "Freezer", "Pantry", "Counter"]


def pantry_status(db) -> s.PantryStatus:
    items = list(db.scalars(select(m.PantryItem)))
    last_photo = db.scalar(select(func.max(m.PantryPhoto.created_at)))
    photo_count = db.scalar(select(func.count(m.PantryPhoto.id))) or 0
    confirmed_at = W.get_setting(db, "pantry_confirmed_at")
    confirmed_dt = datetime.fromisoformat(confirmed_at) if confirmed_at else None
    found = sum(1 for i in items if i.state == "found")
    unsure = sum(1 for i in items if i.state == "unsure")
    newest_item = max((i.created_at for i in items if i.state in ("found", "unsure")), default=None)
    done = bool(confirmed_dt) and (newest_item is None or newest_item <= confirmed_dt)
    return s.PantryStatus(
        last_photo_at=last_photo, photo_count=photo_count, needs_review=found + unsure, unsure=unsure,
        confirmed=sum(1 for i in items if i.state == "confirmed"), confirmed_at=confirmed_dt, done=done,
    )


def pantry_out(db) -> s.Pantry:
    photos = list(db.scalars(select(m.PantryPhoto).order_by(m.PantryPhoto.created_at.desc(), m.PantryPhoto.id.desc())))
    counts = dict(db.execute(select(m.PantryItem.photo_id, func.count(m.PantryItem.id))
                             .where(m.PantryItem.state != "removed").group_by(m.PantryItem.photo_id)).all())
    items = list(db.scalars(select(m.PantryItem).order_by(m.PantryItem.id)))
    areas = list(AREAS)
    for i in items:
        if i.area not in areas:
            areas.append(i.area)
    return s.Pantry(
        photos=[s.PantryPhoto(id=p.id, url=media.url(p.path), label=p.label, uploaded_by=p.uploaded_by,
                              read_at=p.read_at, created_at=p.created_at, item_count=counts.get(p.id, 0))
                for p in photos],
        items=[s.PantryItem.model_validate(i) for i in items],
        areas=areas,
        status=pantry_status(db),
    )


@router.get("", response_model=s.Pantry, operation_id="getPantry")
def get_pantry(db: DB, who: User) -> s.Pantry:
    return pantry_out(db)


@router.post("/photos", response_model=s.Pantry, status_code=201, operation_id="uploadPantryPhotos")
async def upload_photos(
    db: DB,
    who: User,
    cfg: AppSettingsDep,
    files: Annotated[list[UploadFile], File(description="One or more photos")],
    label: Annotated[str | None, Form()] = None,
) -> s.Pantry:
    if not files:
        raise HTTPException(status_code=422, detail="No files")
    for f in files:
        rel = await media.save_upload(cfg.cafe_media_dir, "pantry", f)
        db.add(m.PantryPhoto(path=rel, label=label, uploaded_by=who))
    db.flush()
    return pantry_out(db)


@router.post("/read", response_model=s.JobAccepted, status_code=202, operation_id="readPantry")
def read_pantry(body: s.PantryReadRequest, db: DB, who: User, jobs: Jobs) -> s.JobAccepted:
    ids = body.photo_ids
    if ids is None:
        ids = list(db.scalars(select(m.PantryPhoto.id).where(m.PantryPhoto.read_at.is_(None))))
    job = jobs.enqueue(db, J.PANTRY_READ, {"photo_ids": ids}, who)
    return s.JobAccepted(job=s.Job.model_validate(job))


@router.patch("/items/{item_id}", response_model=s.PantryItem, operation_id="patchPantryItem")
def patch_item(item_id: int, body: s.PantryItemPatch, db: DB, who: User) -> s.PantryItem:
    it = db.get(m.PantryItem, item_id)
    if it is None:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    data = body.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(it, k, v)
    # A person editing what Café read counts as confirming it.
    if ("name" in data or "qty" in data) and "state" not in data and it.state in ("found", "unsure"):
        it.state = "confirmed"
    db.flush()
    return s.PantryItem.model_validate(it)


@router.post("/items", response_model=s.PantryItem, status_code=201, operation_id="addPantryItem")
def add_item(body: s.PantryItemCreate, db: DB, who: User) -> s.PantryItem:
    it = m.PantryItem(area=body.area, name=body.name.strip(), qty=body.qty or "", note=body.note,
                      state="confirmed", added_by=who)
    db.add(it)
    db.flush()
    return s.PantryItem.model_validate(it)


@router.post("/confirm", response_model=s.Pantry, operation_id="confirmPantry")
def confirm(db: DB, who: User) -> s.Pantry:
    for it in db.scalars(select(m.PantryItem).where(m.PantryItem.state == "found")):
        it.state = "confirmed"
    db.flush()
    W.set_setting(db, "pantry_confirmed_at", m.utcnow().isoformat())
    W.set_setting(db, "pantry_confirmed_by", who)
    db.flush()
    return pantry_out(db)
