from __future__ import annotations

import asyncio
from typing import Annotated

from fastapi import APIRouter, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from .. import models as m
from .. import schemas as s
from ..deps import DB, PEOPLE, Jobs, User
from ..jobs import job_dict, sse_format

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/stream", operation_id="streamJobs",
            responses={200: {"content": {"text/event-stream": {"schema": {"type": "string"}}},
                             "description": "Server-sent events. `event: job`, data is a Job (plus optional progress)."}})
async def stream_jobs(
    request: Request,
    x_cafe_user: Annotated[str | None, Header()] = None,
    user: Annotated[str | None, Query(description="For EventSource, which cannot set headers")] = None,
    max_events: Annotated[int | None, Query(ge=1)] = None,
    timeout: Annotated[float | None, Query(gt=0, description="Close after this many seconds")] = None,
    ping: Annotated[float, Query(gt=0)] = 15.0,
) -> StreamingResponse:
    who = (x_cafe_user or user or "").lower()
    if who not in PEOPLE:
        raise HTTPException(status_code=400, detail="X-Cafe-User header (or ?user=) must be one of: lauren, joe, leidy")
    manager = request.app.state.jobs
    db = request.app.state.db
    q = manager.subscribe()

    with db.session() as sess:
        active = [job_dict(j) for j in sess.scalars(
            select(m.Job).where(m.Job.status.in_(["queued", "running"])).order_by(m.Job.id))]

    async def gen():
        sent = 0
        loop = asyncio.get_running_loop()
        deadline = loop.time() + timeout if timeout else None
        try:
            yield ": connected\n\n"
            for ev in active:
                yield sse_format(ev)
                sent += 1
                if max_events and sent >= max_events:
                    return
            while True:
                wait = ping
                if deadline is not None:
                    wait = min(wait, deadline - loop.time())
                    if wait <= 0:
                        return
                try:
                    ev = await asyncio.wait_for(q.get(), timeout=wait)
                except asyncio.TimeoutError:
                    yield ": ping\n\n"
                    continue
                if ev.get("__close__"):
                    return
                yield sse_format(ev)
                sent += 1
                if max_events and sent >= max_events:
                    return
        finally:
            manager.unsubscribe(q)

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.get("", response_model=list[s.Job], operation_id="listJobs")
def list_jobs(db: DB, who: User, active: bool = True, limit: int = Query(default=50, le=200)) -> list[s.Job]:
    stmt = select(m.Job).order_by(m.Job.id.desc()).limit(limit)
    if active:
        stmt = stmt.where(m.Job.status.in_(["queued", "running"]))
    return [s.Job.model_validate(j) for j in db.scalars(stmt)]


@router.get("/{job_id}", response_model=s.Job, operation_id="getJob")
def get_job(job_id: int, db: DB, who: User) -> s.Job:
    j = db.get(m.Job, job_id)
    if j is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return s.Job.model_validate(j)


@router.post("/{job_id}/retry", response_model=s.Job, operation_id="retryJob")
def retry_job(job_id: int, db: DB, who: User, jobs: Jobs) -> s.Job:
    j = db.get(m.Job, job_id)
    if j is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if j.status not in ("failed", "resting"):
        raise HTTPException(status_code=409, detail=f"Job is {j.status}")
    jobs.retry(db, j)
    return s.Job.model_validate(j)
