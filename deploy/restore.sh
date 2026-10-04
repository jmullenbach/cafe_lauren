#!/usr/bin/env bash
# Put a backup back as the Pi's live database.
#
#   deploy/restore.sh            list the backups on the Pi
#   deploy/restore.sh <name>     restore that backup (asks you to type RESTORE)
#   deploy/restore.sh <file>     upload a backup file from this Mac, then restore it
#
# The database being replaced is saved first as before-restore-<time>.db, so a
# restore can itself be undone. Anything entered after the chosen backup was
# taken is not in it.
set -euo pipefail

PI="${CAFE_PI:-joe@cafe.local}"
DATA="cafe_lauren/data"
NAME="${1:-}"

if [[ -z "$NAME" ]]; then
  echo "Backups on the Pi (newest last):"
  ssh "$PI" "cd ~/$DATA/backups && ls -ltr --time-style='+%F %H:%M' *.db | awk '{print \"  \" \$6, \$7, \$8, \"(\" \$5 \" bytes)\"}'"
  echo "Recent pushes:"
  ssh "$PI" "tail -5 ~/$DATA/deploys.log 2>/dev/null | sed 's/^/  /'"
  exit 0
fi

if [[ -f "$NAME" ]]; then
  # A backup file on this Mac (for example from data/pi-backup/): send it to the Pi first,
  # along with the photos saved beside it. Used when rebuilding the Pi from nothing.
  LOCAL="$NAME"; NAME="$(basename "$LOCAL")"
  ssh "$PI" "mkdir -p ~/$DATA/backups ~/$DATA/media"
  rsync -az "$LOCAL" "$PI:~/$DATA/backups/$NAME"
  MEDIA="$(cd "$(dirname "$LOCAL")/.." && pwd)/media"
  [[ -d "$MEDIA" ]] && rsync -az "$MEDIA/" "$PI:~/$DATA/media/"
fi
[[ "$NAME" == */* ]] && { echo "Give a backup name as listed, or the path of a backup file on this Mac." >&2; exit 1; }
ssh "$PI" "test -f ~/$DATA/backups/$NAME" || { echo "No backup named $NAME on the Pi." >&2; exit 1; }

echo "This replaces the Pi's live database with $NAME."
read -r -p "Type RESTORE to continue: " answer
[[ "$answer" == "RESTORE" ]] || { echo "Cancelled."; exit 1; }

ssh "$PI" bash -s -- "$NAME" <<'REMOTE'
set -euo pipefail
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
APP="$HOME/cafe_lauren"
DB="$(grep -E '^CAFE_DB_PATH=' "$APP/.env" | cut -d= -f2-)"
DB="${DB:-$APP/data/cafe.db}"
BACKUP="$APP/data/backups/$1"

python3 -c "import sqlite3,sys; r=sqlite3.connect(sys.argv[1]).execute('pragma integrity_check').fetchone()[0]; sys.exit(0 if r=='ok' else 'Backup is damaged: '+r)" "$BACKUP"
systemctl --user stop cafe-lauren.service
SAVED="$APP/data/backups/before-restore-$(date +%F-%H%M%S).db"
python3 -c "import sqlite3,sys; s=sqlite3.connect(sys.argv[1]); d=sqlite3.connect(sys.argv[2]); s.backup(d); d.close()" "$DB" "$SAVED"
rm -f "$DB-wal" "$DB-shm" "$DB-journal"
cp "$BACKUP" "$DB"
systemctl --user start cafe-lauren.service
echo "Previous database saved as $(basename "$SAVED")"
REMOTE

echo "Waiting for the app"
HEALTH="http://${PI#*@}:8080/api/health"
for _ in $(seq 1 100); do
  curl -fsS -m 5 "$HEALTH" >/dev/null 2>&1 && { echo "Restored. The app is running."; exit 0; }
  sleep 3
done
echo "The app did not come back. Check: ssh ${PI} journalctl --user -u cafe-lauren.service -n 40" >&2
exit 1
