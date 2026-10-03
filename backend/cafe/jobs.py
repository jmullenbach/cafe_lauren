"""Job queue, single worker, handler registry and server-sent event fan-out.

Phase 2 adds AI work by registering handlers:

    from cafe.jobs import registry, JobContext

    @registry.handler("plan_week")
    async def plan_week(ctx: JobContext) -> dict:
        with ctx.session() as db:
            ...
        return {"slots": [...]}            # stored in jobs.result

Raise `JobResting` when the subscription limit is hit (status -> resting),
`JobFailed` to fail with a message shown as-is; any other exception marks the
job failed with its type and text. `JobManager.cancel` marks a queued or running
job `cancelled` (a running one has its asyncio task cancelled). A job whose type has
no handler fails at once with "not available yet", so routes can enqueue
AI work before Phase 2 lands.
"""

from __future__ import annotations

import asyncio
import json
import logging
import threading
from collections.abc import Awaitable, Callable, Iterator
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models as m
from .db import Database

log = logging.getLogger("cafe.jobs")

JOB_STATUSES = ("queued", "running", "done", "failed", "resting", "cancelled")
ACTIVE = ("queued", "running")

# Job types that routes enqueue. Phase 1 registers only "dummy".
PLAN_WEEK = "plan_week"
SWAP_OPTIONS = "swap_options"
REPLACEMENT = "replacement"
RECIPE_DRAFT = "recipe_draft"
RECIPE_FILL = "recipe_fill"
PANTRY_READ = "pantry_read"
ADS_REFRESH = "ads_refresh"
ADS_READ = "ads_read"
CHAT = "chat"
DUMMY = "dummy"


class JobResting(Exception):
    """Raise from a handler when the Claude subscription limit is hit."""


class JobFailed(Exception):
    """Raise from a handler to fail the job with this exact, person-facing message."""


@dataclass
class JobContext:
    id: int
    type: str
    payload: dict[str, Any]
    requested_by: str | None
    db: Database
    manager: JobManager

    @contextmanager
    def session(self) -> Iterator[Session]:
        with self.db.session() as s:
            yield s

    async def progress(self, data: dict[str, Any]) -> None:
        """Push an interim update to SSE listeners (not stored)."""
        self.manager.publish({"id": self.id, "type": self.type, "status": "running", "progress": data})


Handler = Callable[[JobContext], Awaitable[Any]]
FailureHook = Callable[[Session, m.Job], None]


@dataclass
class JobType:
    handler: Handler | None = None
    on_failure: FailureHook | None = None
    on_resting: FailureHook | None = None
    on_retry: FailureHook | None = None
    on_cancel: FailureHook | None = None


@dataclass
class Registry:
    types: dict[str, JobType] = field(default_factory=dict)

    def register(self, type_: str, handler: Handler | None = None, *, on_failure: FailureHook | None = None,
                 on_resting: FailureHook | None = None, on_retry: FailureHook | None = None,
                 on_cancel: FailureHook | None = None) -> None:
        jt = self.types.setdefault(type_, JobType())
        if handler is not None:
            jt.handler = handler
        if on_failure is not None:
            jt.on_failure = on_failure
        if on_resting is not None:
            jt.on_resting = on_resting
        if on_retry is not None:
            jt.on_retry = on_retry
        if on_cancel is not None:
            jt.on_cancel = on_cancel

    def handler(self, type_: str) -> Callable[[Handler], Handler]:
        def deco(fn: Handler) -> Handler:
            self.register(type_, fn)
            return fn

        return deco

    def on_failure(self, type_: str) -> Callable[[FailureHook], FailureHook]:
        def deco(fn: FailureHook) -> FailureHook:
            self.register(type_, on_failure=fn)
            return fn

        return deco

    def on_resting(self, type_: str) -> Callable[[FailureHook], FailureHook]:
        def deco(fn: FailureHook) -> FailureHook:
            self.register(type_, on_resting=fn)
            return fn

        return deco

    def on_retry(self, type_: str) -> Callable[[FailureHook], FailureHook]:
        def deco(fn: FailureHook) -> FailureHook:
            self.register(type_, on_retry=fn)
            return fn

        return deco

    def get(self, type_: str) -> JobType | None:
        return self.types.get(type_)


registry = Registry()


@registry.handler(DUMMY)
async def _dummy(ctx: JobContext) -> Any:
    """Test job: payload {sleep: float, fail: str|None, rest: bool, result: any}."""
    await asyncio.sleep(float(ctx.payload.get("sleep", 0)))
    if ctx.payload.get("rest"):
        raise JobResting("Café is resting. Try again later.")
    if ctx.payload.get("fail"):
        raise RuntimeError(str(ctx.payload["fail"]))
    return ctx.payload.get("result", {"ok": True})


@registry.on_failure(REPLACEMENT)
@registry.on_resting(REPLACEMENT)
def _replacement_stopped(db: Session, job: m.Job) -> None:
    """A rejected slot waiting on a replacement goes back to an open night (job_id kept for Retry)."""
    slot = db.get(m.Slot, job.payload.get("slot_id"))
    if slot is not None and slot.status == "thinking":
        slot.kind = "open"
        slot.recipe_id = None
        slot.status = "rejected"


@registry.on_retry(REPLACEMENT)
def _replacement_retry(db: Session, job: m.Job) -> None:
    """Retrying puts the open night back to thinking so the handler will apply the answer."""
    slot = db.get(m.Slot, job.payload.get("slot_id"))
    if slot is not None and slot.job_id == job.id and slot.kind == "open" and slot.status == "rejected":
        slot.status = "thinking"


def _clear_slot_job(db: Session, job: m.Job) -> None:
    slot_id = (job.payload or {}).get("slot_id")
    slot = db.get(m.Slot, slot_id) if slot_id else None
    if slot is not None and slot.job_id == job.id:
        slot.job_id = None


def job_dict(job: m.Job) -> dict[str, Any]:
    return {
        "id": job.id, "type": job.type, "status": job.status, "payload": job.payload or {},
        "result": job.result, "error": job.error, "requested_by": job.requested_by,
        "created_at": job.created_at.isoformat(), "updated_at": job.updated_at.isoformat(),
    }


class JobManager:
    """One asyncio queue, one worker (one AI job at a time), many SSE listeners."""

    def __init__(self, db: Database, reg: Registry = registry):
        self.db = db
        self.registry = reg
        self.loop: asyncio.AbstractEventLoop | None = None
        self.queue: asyncio.Queue[int] | None = None
        self.worker_task: asyncio.Task | None = None
        self._listeners: set[asyncio.Queue[dict[str, Any]]] = set()
        self._lock = threading.Lock()
        self._pending: list[int] = []
        self._current: tuple[int, asyncio.Task, asyncio.Future] | None = None  # the job the worker is running
        self._tearing_down: set[asyncio.Task] = set()  # cancelled handler tasks still closing their AI call
        self._cancelled: set[int] = set()  # cancel requested; never report these as done

    # ---- lifecycle

    async def start(self) -> None:
        self.loop = asyncio.get_running_loop()
        self.queue = asyncio.Queue()
        with self.db.session() as s:
            for job in s.scalars(select(m.Job).where(m.Job.status.in_(["queued", "running"])).order_by(m.Job.id)):
                job.status = "queued"
                self._pending.append(job.id)
        for jid in self._pending:
            self.queue.put_nowait(jid)
        self._pending.clear()
        self.worker_task = asyncio.create_task(self._worker(), name="cafe-job-worker")

    async def stop(self) -> None:
        if self.worker_task:
            self.worker_task.cancel()
            try:
                await self.worker_task
            except (asyncio.CancelledError, Exception):
                pass
        self.worker_task = None
        for q in list(self._listeners):
            q.put_nowait({"__close__": True})

    @property
    def running(self) -> bool:
        return self.worker_task is not None and not self.worker_task.done()

    # ---- enqueue (callable from request threads)

    def enqueue(self, db: Session, type_: str, payload: dict[str, Any] | None = None,
                requested_by: str | None = None) -> m.Job:
        """Create a job row in the caller's session and schedule it once committed."""
        job = m.Job(type=type_, status="queued", payload=payload or {}, requested_by=requested_by)
        db.add(job)
        db.flush()
        jid = job.id

        @_after_commit(db)
        def _go() -> None:
            self._schedule(jid)
            self.publish(job_dict(job))

        return job

    def _schedule(self, jid: int) -> None:
        if self.loop is None or self.queue is None:
            self._pending.append(jid)
            return
        q = self.queue
        if _in_loop(self.loop):
            q.put_nowait(jid)
        else:
            self.loop.call_soon_threadsafe(q.put_nowait, jid)

    # ---- worker

    async def _worker(self) -> None:
        assert self.queue is not None
        while True:
            jid = await self.queue.get()
            try:
                await self._run(jid)
            except asyncio.CancelledError:
                raise
            except Exception:  # pragma: no cover - defensive
                log.exception("job %s crashed the worker loop", jid)

    def _set(self, jid: int, *, unless_cancelled: bool = False, **fields: Any) -> dict[str, Any] | None:
        with self.db.session() as s:
            job = s.get(m.Job, jid)
            if job is None:
                return None
            if unless_cancelled and job.status == "cancelled":
                return None
            for k, v in fields.items():
                setattr(job, k, v)
            status = fields.get("status")
            jt = self.registry.get(job.type)
            hook = None
            if status == "failed":
                hook = jt.on_failure if jt else None
            elif status == "resting":
                hook = jt.on_resting if jt else None
            elif status == "done":
                hook = _clear_slot_job
            if hook:
                try:
                    hook(s, job)
                except Exception:  # pragma: no cover
                    log.exception("%s hook for %s failed", status, job.type)
            s.flush()
            d = job_dict(job)
        self.publish(d)
        return d

    async def _run(self, jid: int) -> None:
        with self.db.session() as s:
            job = s.get(m.Job, jid)
            if job is None or job.status != "queued":
                self._cancelled.discard(jid)
                return  # cancelled (or already handled) while it waited
            type_, payload, by = job.type, dict(job.payload or {}), job.requested_by
        jt = self.registry.get(type_)
        if jt is None or jt.handler is None:
            self._set(jid, status="failed", error=f"Job type '{type_}' is not available yet.")
            return
        if self._set(jid, unless_cancelled=True, status="running", error=None) is None:
            self._cancelled.discard(jid)
            return
        ctx = JobContext(id=jid, type=type_, payload=payload, requested_by=by, db=self.db, manager=self)
        task = asyncio.create_task(jt.handler(ctx), name=f"cafe-job-{jid}")
        # The worker waits on `settled`, not the task: a cancelled task may take seconds to close its
        # Claude CLI subprocess, and the next job should not wait for that.
        settled: asyncio.Future = asyncio.get_running_loop().create_future()
        task.add_done_callback(lambda _t: settled.done() or settled.set_result(None))
        self._current = (jid, task, settled)
        try:
            await settled
            if not task.done():  # cancelled; let it finish closing in the background
                self._tearing_down.add(task)
                task.add_done_callback(_settle_torn_down(self._tearing_down))
                raise asyncio.CancelledError
            result = task.result()
        except asyncio.CancelledError:
            if jid in self._cancelled and not _cancelling(asyncio.current_task()):
                self._set(jid, status="cancelled", error=None)  # superseded: the handler task was torn down
                return
            task.cancel()
            self._set(jid, status="queued")  # the worker itself is stopping; run it again next start
            raise
        except JobResting as e:
            self._set(jid, unless_cancelled=True, status="resting", error=str(e) or "Café is resting. Try again later.")
        except JobFailed as e:
            self._set(jid, unless_cancelled=True, status="failed", error=str(e))
        except Exception as e:
            log.exception("job %s (%s) failed", jid, type_)
            self._set(jid, unless_cancelled=True, status="failed", error=f"{type(e).__name__}: {e}")
        else:
            if jid in self._cancelled:
                self._set(jid, status="cancelled", error=None)
            else:
                self._set(jid, status="done", result=_jsonable(result))
        finally:
            self._current = None
            self._cancelled.discard(jid)

    def cancel(self, db: Session, job: m.Job) -> bool:
        """Mark a queued or running job cancelled. A running job's task is cancelled once this commits,
        which closes its Claude call (and the CLI subprocess). Returns False if the job had finished."""
        if job.status not in ACTIVE:
            return False
        job.status = "cancelled"
        job.error = None
        jt = self.registry.get(job.type)
        if jt and jt.on_cancel:
            jt.on_cancel(db, job)
        db.flush()
        jid = job.id
        with self._lock:
            self._cancelled.add(jid)
        event = job_dict(job)

        @_after_commit(db)
        def _go() -> None:
            self.publish(event)
            if self.loop is not None:
                if _in_loop(self.loop):
                    self._cancel_task(jid)
                else:
                    self.loop.call_soon_threadsafe(self._cancel_task, jid)

        return True

    def _cancel_task(self, jid: int) -> None:
        cur = self._current
        if cur is not None and cur[0] == jid and not cur[1].done():
            cur[1].cancel()
            if not cur[2].done():
                cur[2].set_result(None)

    def retry(self, db: Session, job: m.Job) -> m.Job:
        job.status = "queued"
        job.error = None
        job.result = None
        jt = self.registry.get(job.type)
        if jt and jt.on_retry:
            jt.on_retry(db, job)
        db.flush()
        jid = job.id

        @_after_commit(db)
        def _go() -> None:
            self._schedule(jid)
            self.publish(job_dict(job))

        return job

    # ---- SSE fan-out

    def publish(self, event: dict[str, Any]) -> None:
        with self._lock:
            listeners = list(self._listeners)
        loop = self.loop
        for q in listeners:
            if loop is not None and not _in_loop(loop):
                loop.call_soon_threadsafe(q.put_nowait, event)
            else:
                q.put_nowait(event)

    def subscribe(self) -> asyncio.Queue[dict[str, Any]]:
        q: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
        with self._lock:
            self._listeners.add(q)
        return q

    def unsubscribe(self, q: asyncio.Queue[dict[str, Any]]) -> None:
        with self._lock:
            self._listeners.discard(q)


def _settle_torn_down(pending: set[asyncio.Task]) -> Callable[[asyncio.Task], None]:
    def done(t: asyncio.Task) -> None:
        pending.discard(t)
        if not t.cancelled() and t.exception() is not None:
            log.info("cancelled job task ended with %r", t.exception())
    return done


def _cancelling(task: asyncio.Task | None) -> bool:
    """True when `task` (the worker) has itself been asked to stop."""
    return bool(task is not None and task.cancelling())


def _in_loop(loop: asyncio.AbstractEventLoop) -> bool:
    try:
        return asyncio.get_running_loop() is loop
    except RuntimeError:
        return False


def _after_commit(db: Session) -> Callable[[Callable[[], None]], Callable[[], None]]:
    from sqlalchemy import event

    def deco(fn: Callable[[], None]) -> Callable[[], None]:
        event.listen(db, "after_commit", lambda _s: fn(), once=True)
        return fn

    return deco


def _jsonable(v: Any) -> Any:
    try:
        json.dumps(v)
        return v
    except TypeError:
        if hasattr(v, "model_dump"):
            return v.model_dump(mode="json")
        return json.loads(json.dumps(v, default=str))


def sse_format(event: dict[str, Any], name: str = "job") -> str:
    return f"event: {name}\ndata: {json.dumps(event, default=str)}\n\n"
