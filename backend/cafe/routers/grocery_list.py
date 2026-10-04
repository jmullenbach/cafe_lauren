from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy import select

from .. import models as m
from .. import schemas as s
from ..deps import DB, User
from ..services import grocery
from ..services import weeks as W

router = APIRouter(prefix="/api/weeks/{monday}/list", tags=["list"])


def list_out(db, week: m.Week) -> s.GroceryList:
    items = grocery.derive_items(db, week)
    return s.GroceryList.model_validate({
        "monday": week.monday, "approved": week.approved_at is not None,
        "approved_by": week.approved_by, "approved_at": week.approved_at,
        "sections": grocery.group_sections(items), "diff": grocery.diff(db, week),
        "total": len(items), "unchecked": sum(1 for i in items if not i.checked),
    })


def _item(db, week: m.Week, key: str) -> grocery.Item:
    try:
        return grocery.find_item(db, week, key)
    except LookupError:
        raise HTTPException(status_code=404, detail="List item not found") from None


@router.get("", response_model=s.GroceryList, operation_id="getList")
def get_list(monday: date, db: DB, who: User) -> s.GroceryList:
    return list_out(db, W.get_or_create_week(db, monday))


@router.post("/items", response_model=s.GroceryList, status_code=201, operation_id="addListItem")
def add_item(monday: date, body: s.ListItemCreate, db: DB, who: User) -> s.GroceryList:
    week = W.get_or_create_week(db, monday)
    grocery.add_item(db, week, body.text, who, section=body.section, note=body.note)
    return list_out(db, week)


@router.patch("/items/{key}", response_model=s.GroceryList, operation_id="patchListItem")
def patch_item(monday: date, key: str, body: s.ListItemPatch, db: DB, who: User) -> s.GroceryList:
    week = W.get_or_create_week(db, monday)
    _item(db, week, key)
    grocery.patch_item(db, week, key, body.model_dump(exclude_unset=True))
    return list_out(db, week)


@router.delete("/items/{key}", response_model=s.GroceryList, operation_id="deleteListItem")
def delete_item(monday: date, key: str, db: DB, who: User) -> s.GroceryList:
    week = W.get_or_create_week(db, monday)
    try:
        grocery.remove_item(db, week, key)
    except LookupError:
        raise HTTPException(status_code=404, detail="List item not found") from None
    return list_out(db, week)


@router.post("/items/{key}/check", response_model=s.GroceryList, operation_id="checkListItem")
def check_item(monday: date, key: str, body: s.CheckRequest, db: DB, who: User) -> s.GroceryList:
    week = W.get_or_create_week(db, monday)
    _item(db, week, key)
    row = db.scalar(select(m.ListCheck).where(m.ListCheck.week_id == week.id, m.ListCheck.item_key == key))
    want = (row is None) if body.checked is None else body.checked
    if want and row is None:
        db.add(m.ListCheck(week_id=week.id, item_key=key, checked_by=who))
    elif not want and row is not None:
        db.delete(row)
    db.flush()
    return list_out(db, week)


@router.post("/confirm-diff", response_model=s.GroceryList, operation_id="confirmListDiff")
def confirm_diff(monday: date, db: DB, who: User) -> s.GroceryList:
    week = W.get_or_create_week(db, monday)
    if week.approved_at is None:
        raise HTTPException(status_code=409, detail="Week is not approved yet")
    week.approved_list = grocery.snapshot(db, week)
    db.flush()
    return list_out(db, week)


@router.get("/text", response_class=PlainTextResponse, operation_id="getListText",
            responses={200: {"content": {"text/plain": {"schema": {"type": "string"}}}}})
def list_text(monday: date, db: DB, who: User, include_checked: bool = False) -> str:
    week = W.get_or_create_week(db, monday)
    items = grocery.derive_items(db, week)
    return grocery.as_text(items, f"Grocery list · {W.week_label(week.monday)}", include_checked)
