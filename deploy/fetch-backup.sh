#!/usr/bin/env bash
# Pull the Pi's database backups and photos onto this Mac, in case the SD card fails.
set -euo pipefail

PI="${CAFE_PI:-joe@cafe.local}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/data/pi-backup"
mkdir -p "$OUT"

ssh "$PI" "bash ~/cafe_lauren/deploy/backup.sh"
rsync -az "$PI:~/cafe_lauren/data/backups/" "$OUT/backups/"
rsync -az "$PI:~/cafe_lauren/data/media/" "$OUT/media/"
echo "Saved to $OUT"
