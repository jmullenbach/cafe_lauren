from __future__ import annotations

from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile
from sqlalchemy import select

from .. import jobs as J
from .. import models as m
from .. import schemas as s
from ..deps import DB, AppSettingsDep, Jobs, User
from ..services import media
from ..services import weeks as W

router = APIRouter(tags=["stores"])

INSTACART_DEFAULT_STORE = "cermak"


def _store(db, store_id: int) -> m.Store:
    st = db.get(m.Store, store_id)
    if st is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return st


def _has_current_deals(db, store: m.Store, monday: date) -> bool:
    return db.scalar(select(m.Deal.id).where(
        m.Deal.store_id == store.id,
        (m.Deal.valid_to.is_(None)) | (m.Deal.valid_to >= monday - timedelta(days=7)),
    ).limit(1)) is not None


@router.get("/api/stores", response_model=list[s.Store], operation_id="listStores")
def list_stores(db: DB, who: User, cfg: AppSettingsDep) -> list[s.Store]:
    on = W.today(cfg.cafe_timezone)
    return [s.Store.model_validate(W.store_out(db, st, on)) for st in db.scalars(select(m.Store).order_by(m.Store.id))]


@router.put("/api/weeks/{monday}/store", response_model=s.StoreChangeResponse, operation_id="setWeekStore")
def set_store(monday: date, body: s.WeekStoreRequest, db: DB, who: User, jobs: Jobs) -> s.StoreChangeResponse:
    week = W.get_or_create_week(db, monday)
    st = db.scalar(select(m.Store).where(m.Store.key == body.store_key))
    if st is None:
        raise HTTPException(status_code=404, detail="Store not found")
    job = None
    notice = None
    if week.store_id != st.id:
        week.store_id = st.id
        db.flush()
        if not _has_current_deals(db, st, monday):
            job = jobs.enqueue(db, J.ADS_REFRESH, {"store_id": st.id, "store_key": st.key}, who)
            notice = f"Reading {st.name}'s weekly ad…"
    return s.StoreChangeResponse(week=W.week_out(db, week), notice=notice,
                                 job=s.Job.model_validate(job) if job else None)


@router.put("/api/weeks/{monday}/order-via", response_model=s.StoreChangeResponse, operation_id="setOrderVia")
def set_order_via(monday: date, body: s.OrderViaRequest, db: DB, who: User) -> s.StoreChangeResponse:
    """Keeps store and method consistent, as in store.jsx setOrderVia."""
    week = W.get_or_create_week(db, monday)
    week.order_via = body.order_via
    notice = None
    current = week.store.key if week.store else None
    target = None
    if body.order_via == "amazon" and current != "amazon":
        target, notice = "amazon", "Switched ads to Amazon Fresh"
    elif body.order_via in ("delivery", "pickup") and current == "amazon":
        target = W.get_setting(db, "default_store", INSTACART_DEFAULT_STORE)
        if target == "amazon":
            target = INSTACART_DEFAULT_STORE
    if target:
        st = db.scalar(select(m.Store).where(m.Store.key == target))
        if st is not None:
            week.store_id = st.id
            if notice is None:
                notice = f"Switched ads to {st.name}"
    db.flush()
    return s.StoreChangeResponse(week=W.week_out(db, week), notice=notice)


@router.post("/api/stores/{store_id}/ads/refresh", response_model=s.JobAccepted, status_code=202,
             operation_id="refreshAds")
def refresh_ads(store_id: int, db: DB, who: User, jobs: Jobs) -> s.JobAccepted:
    st = _store(db, store_id)
    job = jobs.enqueue(db, J.ADS_REFRESH, {"store_id": st.id, "store_key": st.key}, who)
    return s.JobAccepted(job=s.Job.model_validate(job))


@router.post("/api/stores/{store_id}/ads/upload", response_model=s.AdUploadResponse, status_code=201,
             operation_id="uploadAds")
async def upload_ads(
    store_id: int, db: DB, who: User, jobs: Jobs, cfg: AppSettingsDep,
    files: Annotated[list[UploadFile], File(description="Photos or PDFs of the weekly ad")],
) -> s.AdUploadResponse:
    st = _store(db, store_id)
    paths = [await media.save_upload(cfg.cafe_media_dir, f"ads/{st.key}", f) for f in files]
    job = jobs.enqueue(db, J.ADS_READ, {"store_id": st.id, "store_key": st.key, "paths": paths}, who)
    return s.AdUploadResponse(files=[media.url(p) for p in paths], job=s.Job.model_validate(job))


@router.get("/api/deals", response_model=list[s.Deal], operation_id="listDeals")
def list_deals(db: DB, who: User, cfg: AppSettingsDep, store_key: str | None = None,
               current: bool = True) -> list[s.Deal]:
    stmt = select(m.Deal).join(m.Store).order_by(m.Store.id, m.Deal.id)
    if store_key:
        stmt = stmt.where(m.Store.key == store_key)
    if current:
        on = W.today(cfg.cafe_timezone)
        stmt = stmt.where((m.Deal.valid_to.is_(None)) | (m.Deal.valid_to >= on - timedelta(days=7)))
    return [s.Deal(id=d.id, store_id=d.store_id, store_key=d.store.key, valid_from=d.valid_from,
                   valid_to=d.valid_to, item=d.item, price=d.price, unit=d.unit, section=d.section,
                   source_image=d.source_image) for d in db.scalars(stmt)]
