#!/usr/bin/env bash
# Runs on the Pi each night. Keeps 14 dated copies of the database in data/backups/.
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
DB="$(grep -E '^CAFE_DB_PATH=' "$APP/.env" | cut -d= -f2-)"
DB="${DB:-$APP/data/cafe.db}"
OUT="$APP/data/backups"
mkdir -p "$OUT"

# sqlite's backup call gives a consistent copy even while the app is writing.
python3 - "$DB" "$OUT/nightly-$(date +%F).db" <<'PY'
import sqlite3, sys
src, dst = sqlite3.connect(sys.argv[1]), sqlite3.connect(sys.argv[2])
with dst:
    src.backup(dst)
PY
ls -1 "$OUT"/nightly-*.db | sort | head -n -14 | xargs -r rm --
