#!/usr/bin/env bash
# Test, build and install the app on the Pi. Never touches the Pi's database or media.
#
#   deploy/push.sh                  ship the current commit
#   deploy/push.sh --ref <commit>   ship an earlier commit (this is how you roll back code)
#   deploy/push.sh --with-env       also rewrite the Pi's .env from this Mac's .env
#   deploy/push.sh --allow-dirty    ship uncommitted changes too
#   deploy/push.sh --skip-tests     skip the backend tests
#   deploy/push.sh --dry-run        test and build, show what would be copied, change nothing
set -euo pipefail

PI="${CAFE_PI:-joe@cafe.local}"
DEST="cafe_lauren"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REF="" WITH_ENV=0 ALLOW_DIRTY=0 SKIP_TESTS=0 DRY=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref) REF="${2:?--ref needs a commit}"; shift ;;
    --with-env) WITH_ENV=1 ;;
    --allow-dirty) ALLOW_DIRTY=1 ;;
    --skip-tests) SKIP_TESTS=1 ;;
    --dry-run) DRY=1 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
cd "$ROOT"

SRC="$ROOT"
if [[ -n "$REF" ]]; then
  # Build the requested commit in a temporary checkout, leaving the working folder alone.
  SRC="$(mktemp -d)/src"
  git worktree add --detach --quiet "$SRC" "$REF"
  trap 'git -C "$ROOT" worktree remove --force "$SRC"' EXIT
  # Always use today's deploy scripts, so an old commit still installs correctly.
  rm -rf "$SRC/deploy" && cp -R "$ROOT/deploy" "$SRC/deploy"
  VERSION="$(git rev-parse --short "$REF")"
else
  VERSION="$(git rev-parse --short HEAD)"
  if [[ -n "$(git status --porcelain -- backend frontend deploy)" ]]; then
    if [[ $ALLOW_DIRTY -eq 0 ]]; then
      echo "There are uncommitted changes in backend/, frontend/ or deploy/." >&2
      echo "Commit them first so this push can be rolled back, or pass --allow-dirty." >&2
      exit 1
    fi
    VERSION="$VERSION+uncommitted"
  fi
fi

if [[ $SKIP_TESTS -eq 0 ]]; then
  echo "==> Running backend tests"
  (cd "$SRC/backend" && uv run -q pytest -q)
fi

echo "==> Building the frontend"
(cd "$SRC/frontend" && { [[ -d node_modules ]] || npm ci --silent; } && npm run build)

# Only backend/, frontend/dist/ and deploy/ are sent. The Pi's .env, data/ and
# virtual environment are left alone.
RSYNC=(rsync -az --delete
  --exclude='.venv/' --exclude='__pycache__/' --exclude='.pytest_cache/' --exclude='.DS_Store'
  --exclude='/deploy/pi-firstboot/wifi.env'
  --include='/backend/***'
  --include='/frontend/' --include='/frontend/dist/***'
  --include='/deploy/***'
  --exclude='*')

if [[ $DRY -eq 1 ]]; then
  echo "==> Dry run: $VERSION would be copied to $PI. Files that differ:"
  "${RSYNC[@]}" -n -i "$SRC/" "$PI:~/$DEST/" | grep -v '/$' | head -40
  exit 0
fi

echo "==> Copying $VERSION to $PI:~/$DEST"
ssh "$PI" "mkdir -p ~/$DEST/data"
"${RSYNC[@]}" "$SRC/" "$PI:~/$DEST/"

if [[ $WITH_ENV -eq 1 ]]; then
  echo "==> Writing .env on the Pi"
  PI_HOME="$(ssh "$PI" 'echo $HOME')"
  # The token goes straight over ssh and is never printed.
  {
    grep -E '^(CLAUDE_CODE_OAUTH_TOKEN|INSTACART_API_KEY|INSTACART_BASE|CAFE_TIMEZONE)=' "$ROOT/.env" || true
    echo "CAFE_AI=claude"
    echo "CAFE_DB_PATH=$PI_HOME/$DEST/data/household.db"
  } | ssh "$PI" "umask 077 && cat > ~/$DEST/.env"
fi

echo "==> Installing on the Pi"
# The install runs detached on the Pi and is checked with short connections,
# because a long SSH session over the Pi's Wi-Fi can drop while the service restarts.
STAMP="$VERSION $(date '+%F %H:%M:%S')"
LOG="~/$DEST/data/last-install.log"
ssh "$PI" "echo '$STAMP' >> ~/$DEST/data/deploys.log
  nohup bash -c 'bash ~/$DEST/deploy/setup-pi.sh --no-wait; echo \"finished \$? $STAMP\"' > $LOG 2>&1 < /dev/null &"

RESULT=""
for _ in $(seq 1 120); do
  RESULT="$(ssh -o ConnectTimeout=10 "$PI" "tail -1 $LOG" 2>/dev/null || true)"
  [[ "$RESULT" == "finished "*"$STAMP" ]] && break
  sleep 5
done
if [[ "$RESULT" != "finished 0 $STAMP" ]]; then
  echo "The install on the Pi did not finish cleanly. Its log:" >&2
  ssh -o ConnectTimeout=10 "$PI" "cat $LOG" >&2 || true
  exit 1
fi

echo "==> Waiting for the app"
HEALTH="http://${PI#*@}:8080/api/health"
for _ in $(seq 1 100); do
  if curl -fsS -m 5 "$HEALTH" 2>/dev/null; then
    echo; echo "==> Shipped $VERSION"
    exit 0
  fi
  sleep 3
done
echo "The app did not answer at $HEALTH. Check: ssh ${PI} journalctl --user -u cafe-lauren.service -n 40" >&2
exit 1
