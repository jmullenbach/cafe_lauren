"""Manual smoke test of the real Claude path (CAFE_AI=claude). Uses the owner's subscription.

    cd backend && uv run python scripts/ai_smoke.py [--photos 2] [--ads 2] [--keep]

Works on a scratch copy of data/cafe.db in a temp folder (the real database is
never written). If the copy has no saved recipes, the demo data is seeded so
the plan has a recipe box to draw from. Then, through the real job worker:

  1. pantry_read on N photos from images/pantry/   -> found/unsure pantry items
  2. ads_read on N images from images/ads/ (Cermak) -> deals
  3. plan_week for an empty week                   -> suggested slots

and prints a summary with timings. About 3 Claude calls (one more per
validation retry).
"""

from __future__ import annotations

import argparse
import asyncio
import shutil
import sqlite3
import sys
import tempfile
import time
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402

from cafe import jobs as J  # noqa: E402
from cafe import models as m  # noqa: E402
from cafe.ai import client as C  # noqa: E402
from cafe.ai import handlers  # noqa: E402,F401  (registers handlers)
from cafe.config import REPO_ROOT, get_settings  # noqa: E402
from cafe.db import Database, run_migrations  # noqa: E402
from cafe.jobs import JobManager  # noqa: E402
from cafe.services import weeks as W  # noqa: E402

TERMINAL = {"done", "failed", "resting"}


def scratch_copy(src: Path, dest: Path) -> None:
    """Consistent copy even while the app has the database open (WAL)."""
    if not src.exists():
        return
    with sqlite3.connect(src) as a, sqlite3.connect(dest) as b:
        a.backup(b)


async def wait(db: Database, jid: int, timeout: float = 900) -> m.Job:
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        with db.session() as s:
            job = s.get(m.Job, jid)
            if job.status in TERMINAL:
                s.expunge(job)
                return job
        await asyncio.sleep(0.5)
    raise TimeoutError(f"job {jid} still running")



def queue_pantry(db: Database, manager: JobManager, settings, n: int) -> int:
    photos = sorted((REPO_ROOT / "images" / "pantry").glob("*.jp*g"))[:n]
    with db.session() as s:
        ids = []
        for p in photos:
            rel = Path("pantry/smoke") / p.name
            (settings.cafe_media_dir / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(p, settings.cafe_media_dir / rel)
            row = m.PantryPhoto(path=rel.as_posix(), label="smoke", uploaded_by="joe")
            s.add(row)
            s.flush()
            ids.append(row.id)
        return manager.enqueue(s, J.PANTRY_READ, {"photo_ids": ids}, "joe").id


def queue_ads(db: Database, manager: JobManager, settings, n: int) -> int:
    images = sorted((REPO_ROOT / "images" / "ads").glob("*.jp*g"))[:n]
    with db.session() as s:
        store = s.scalar(select(m.Store).where(m.Store.key == "cermak"))
        folder = Path("ads/cermak/smoke")
        (settings.cafe_media_dir / folder).mkdir(parents=True, exist_ok=True)
        rels = []
        for p in images:
            shutil.copyfile(p, settings.cafe_media_dir / folder / p.name)
            rels.append((folder / p.name).as_posix())
        return manager.enqueue(s, J.ADS_READ, {"store_id": store.id, "store_key": "cermak", "paths": rels}, "joe").id


async def main(args: argparse.Namespace) -> int:
    base = get_settings()
    if not base.claude_code_oauth_token:
        print("CLAUDE_CODE_OAUTH_TOKEN is not set in .env")
        return 2
    tmp = Path(args.scratch) if args.scratch else Path(tempfile.mkdtemp(prefix="cafe-smoke-"))
    if args.scratch and not (tmp / "cafe.db").exists():
        print(f"No cafe.db in {tmp}")
        return 2
    if tmp.resolve() == base.cafe_db_path.parent.resolve():
        print("Refusing to run against the real data folder")
        return 2
    settings = base.model_copy(update={"cafe_db_path": tmp / "cafe.db", "cafe_media_dir": tmp / "media",
                                       "cafe_ai": "claude", "cafe_start_scheduler": False})
    if not args.scratch:
        scratch_copy(base.cafe_db_path, settings.cafe_db_path)
    run_migrations(settings.cafe_db_path)
    settings.cafe_media_dir.mkdir(parents=True, exist_ok=True)
    db = Database(settings)
    print(f"Scratch database: {settings.cafe_db_path}")

    with db.session() as s:
        if s.scalar(select(m.Recipe.id).where(m.Recipe.status == "saved").limit(1)) is None:
            from cafe import seed_demo

            seed_demo.seed(s, settings, copy_photos=False)
            print("No saved recipes in the copy: seeded the demo recipe box.")
        models = W.get_setting(s, "models") or {}
    ai = C.ClaudeCafeAI(settings.claude_code_oauth_token, models)
    C.set_ai(ai)

    manager = JobManager(db)
    await manager.start()
    queued: list[tuple[str, int]] = []
    try:
        if not args.plan_only:
            queued.append(("pantry_read", queue_pantry(db, manager, settings, args.photos)))
            queued.append(("ads_read", queue_ads(db, manager, settings, args.ads)))

        # 3. plan an empty week (the first Monday with no week row), after the deals are in
        with db.session() as s:
            monday = W.monday_of(W.today(settings.cafe_timezone)) + timedelta(days=7)
            while s.scalar(select(m.Week.id).where(m.Week.monday == monday)) is not None:
                monday += timedelta(days=7)
            week = W.get_or_create_week(s, monday)
            queued.append(("plan_week", manager.enqueue(s, J.PLAN_WEEK, {"week_id": week.id, "monday": monday.isoformat()}, "joe").id))

        t0 = time.monotonic()
        results = {}
        for name, jid in queued:
            job = await wait(db, jid)
            results[name] = job
            print(f"\n[{name}] {job.status} after {time.monotonic() - t0:.0f}s total"
                  + (f" -- {job.error}" if job.error else ""))
            print(f"  result: {job.result}")
    finally:
        await manager.stop()
        C.set_ai(None)

    print("\nClaude calls:")
    for c in ai.calls:
        cost = f"${c['cost_usd']:.3f}" if c.get("cost_usd") is not None else "-"
        print(f"  {c['task']:<12} {c['model']:<20} {c['seconds']:>6.1f}s  turns={c['turns']}  {cost}  {c['outcome']}")

    with db.session() as s:
        items = list(s.scalars(select(m.PantryItem).where(m.PantryItem.photo_id.is_not(None))))
        print(f"\nPantry: {len(items)} items ({sum(i.state == 'found' for i in items)} found, "
              f"{sum(i.state == 'unsure' for i in items)} unsure)")
        for i in items[:12]:
            print(f"  [{i.state:6}] {i.area:8} {i.name} ({i.qty})" + (f" -- {i.note}" if i.note else ""))
        deals = list(s.scalars(select(m.Deal).where(m.Deal.source_image.like("ads/cermak/smoke/%"))))
        print(f"\nDeals: {len(deals)} read" + (f", valid {deals[0].valid_from} to {deals[0].valid_to}" if deals else ""))
        for d in deals[:12]:
            unit = f"/{d.unit}" if d.unit and "/" not in d.price else ""
            print(f"  {d.section:9} {d.item}: {d.price}{unit}")
        week = s.scalar(select(m.Week).where(m.Week.monday == monday))
        print(f"\nPlan for {W.week_label(monday)}: {(results['plan_week'].result or {}).get('summary', '')}")
        for sl in sorted(week.slots, key=lambda x: W.DAYS.index(x.day)):
            r = sl.recipe
            what = f"{r.title} [{r.status}/{r.source}]" if r else (sl.text or "-")
            print(f"  {sl.day}: {sl.kind:8} {sl.status or '':9} {what}")
            if sl.why:
                print(f"         why: {'; '.join(sl.why)}")
            sale = [f"{k} {v['sale']}" for k, v in (sl.ingredient_flags or {}).items() if v.get("sale")]
            have = [k for k, v in (sl.ingredient_flags or {}).items() if v.get("have")]
            if sale or have:
                print(f"         sale: {', '.join(sale) or '-'} | have: {', '.join(have) or '-'}")
    db.dispose()
    ok = all(j.status == "done" for j in results.values())
    if not args.keep:
        shutil.rmtree(tmp, ignore_errors=True)
    else:
        print(f"\nKept scratch folder: {tmp}")
    print("\nSMOKE " + ("OK" if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--photos", type=int, default=2)
    ap.add_argument("--ads", type=int, default=2)
    ap.add_argument("--keep", action="store_true", help="keep the scratch database and media")
    ap.add_argument("--scratch", help="reuse a scratch folder kept by an earlier --keep run")
    ap.add_argument("--plan-only", action="store_true", help="skip the pantry and ad reads (1 call)")
    sys.exit(asyncio.run(main(ap.parse_args())))
