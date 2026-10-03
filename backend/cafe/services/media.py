"""Uploaded files under the media dir, served at /media."""

from __future__ import annotations

import uuid
from datetime import date
from pathlib import Path

from fastapi import HTTPException, UploadFile

ALLOWED = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".pdf"}
MAX_BYTES = 25 * 1024 * 1024


def url(rel: str) -> str:
    return "/media/" + rel.lstrip("/")


async def save_upload(media_dir: Path, folder: str, f: UploadFile) -> str:
    """Save one upload as <folder>/<YYYY-MM-DD>/<uuid><ext>; return the media-relative path."""
    ext = Path(f.filename or "").suffix.lower() or ".jpg"
    if ext not in ALLOWED:
        raise HTTPException(status_code=415, detail=f"Unsupported file type {ext}")
    rel = Path(folder) / date.today().isoformat() / f"{uuid.uuid4().hex}{ext}"
    dest = media_dir / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    size = 0
    with dest.open("wb") as out:
        while chunk := await f.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_BYTES:
                out.close()
                dest.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="File too large")
            out.write(chunk)
    return rel.as_posix()
