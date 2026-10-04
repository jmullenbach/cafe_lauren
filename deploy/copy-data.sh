#!/usr/bin/env bash
# One-time move of the household database and photos from this Mac to the Pi.
# After this, the Pi's copy is the real one. Stop using the Mac's copy.
#
#   deploy/copy-data.sh           refuses if the Pi already has a database
#   deploy/copy-data.sh --force   replaces the Pi's database (it is backed up on the Pi first)
set -euo pipefail

PI="${CAFE_PI:-joe@cafe.local}"
DEST="cafe_lauren"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DB="$(grep -E '^CAFE_DB_PATH=' "$ROOT/.env" | cut -d= -f2-)"
SRC_DB="${SRC_DB:-$ROOT/data/cafe.db}"
NAME="household.db"

if ssh "$PI" "test -f ~/$DEST/data/$NAME"; then
  if [[ "${1:-}" != "--force" ]]; then
    echo "The Pi already has a database. Nothing copied. Use --force to replace it." >&2
    exit 1
  fi
  ssh "$PI" "mkdir -p ~/$DEST/data/backups && cp ~/$DEST/data/$NAME ~/$DEST/data/backups/replaced-\$(date +%F-%H%M).db"
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
echo "==> Taking a consistent copy of $SRC_DB"
sqlite3 "$SRC_DB" ".backup '$TMP/$NAME'"

echo "==> Copying database and photos to $PI"
ssh "$PI" "systemctl --user stop cafe-lauren.service 2>/dev/null || true; mkdir -p ~/$DEST/data/media; rm -f ~/$DEST/data/$NAME-wal ~/$DEST/data/$NAME-shm"
rsync -az "$TMP/$NAME" "$PI:~/$DEST/data/$NAME"
rsync -az "$ROOT/data/media/" "$PI:~/$DEST/data/media/"
ssh "$PI" "systemctl --user start cafe-lauren.service 2>/dev/null || true"
echo "==> Done"
