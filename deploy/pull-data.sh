#!/usr/bin/env bash
# Replace this Mac's development database and photos with a fresh copy from the Pi.
# The Pi is the real copy; data only ever flows Pi -> Mac.
# The Mac's current database is saved in data/backups/ first.
set -euo pipefail

PI="${CAFE_PI:-joe@cafe.local}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$(grep -E '^CAFE_DB_PATH=' "$ROOT/.env" | cut -d= -f2-)"
DB="${DB:-$ROOT/data/cafe.db}"

if [[ -e "$DB" ]] && lsof "$DB" >/dev/null 2>&1; then
  echo "The local app is running and has $DB open. Stop it first, then run this again." >&2
  exit 1
fi

"$ROOT/deploy/fetch-backup.sh"
NEWEST="$(ls -1 "$ROOT"/data/pi-backup/backups/nightly-*.db | sort | tail -1)"

mkdir -p "$ROOT/data/backups" "$ROOT/data/media"
if [[ -f "$DB" ]]; then
  sqlite3 "$DB" ".backup '$ROOT/data/backups/mac-before-pull-$(date +%F-%H%M).db'"
fi
rm -f "$DB-wal" "$DB-shm" "$DB-journal"
cp "$NEWEST" "$DB"
rsync -a "$ROOT/data/pi-backup/media/" "$ROOT/data/media/"
echo "Local database is now a copy of the Pi's ($(basename "$NEWEST"))."
