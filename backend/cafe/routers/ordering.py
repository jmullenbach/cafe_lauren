from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException

from .. import schemas as s
from ..deps import DB, AppSettingsDep, User
from ..services import instacart
from ..services import weeks as W

router = APIRouter(tags=["ordering"])


@router.post("/api/weeks/{monday}/instacart-link", response_model=s.InstacartLink,
             operation_id="createInstacartLink",
             responses={409: {"description": 'detail.code is "instacart_not_configured"'},
                        502: {"description": "Instacart failed"}})
def instacart_link(monday: date, db: DB, who: User, cfg: AppSettingsDep) -> s.InstacartLink:
    week = W.get_or_create_week(db, monday)
    try:
        url, cached, n = instacart.link_for_week(db, cfg, week)
    except instacart.InstacartNotConfigured:
        raise HTTPException(status_code=409, detail={"code": "instacart_not_configured",
                                                     "message": "Instacart is not set up yet"})
    except instacart.InstacartError as e:
        db.commit()
        raise HTTPException(status_code=502, detail={"code": "instacart_error", "message": str(e)})
    return s.InstacartLink(url=url, cached=cached, item_count=n)
