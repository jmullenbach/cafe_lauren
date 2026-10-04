#!/usr/bin/env bash
# Runs on the Pi (deploy/push.sh calls it). Safe to run again.
# Installs uv and the Python packages, then installs and restarts the services.
# Needs no admin rights: the app runs as a per-user service that starts at boot.
set -euo pipefail

APP="$HOME/cafe_lauren"
UV="$HOME/.local/bin/uv"
UNITS="$HOME/.config/systemd/user"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

if [[ "$(uname -m)" != "aarch64" ]]; then
  echo "This Pi is not running a 64-bit OS ($(uname -m)). Reinstall with Raspberry Pi OS (64-bit)." >&2
  exit 1
fi
if [[ ! -f "$APP/.env" ]]; then
  echo "No $APP/.env yet. Run deploy/push.sh --with-env from the Mac." >&2
  exit 1
fi

if [[ ! -x "$UV" ]]; then
  echo "==> Installing uv"
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

echo "==> Installing Python packages"
cd "$APP/backend"
"$UV" sync --frozen --no-dev --python 3.12

echo "==> Installing services"
mkdir -p "$UNITS"
cp "$APP"/deploy/cafe-lauren.service "$APP"/deploy/cafe-backup.service "$APP"/deploy/cafe-backup.timer "$UNITS/"
chmod +x "$APP/deploy/backup.sh"
loginctl enable-linger "$USER"   # start the services at boot, without anyone logged in
systemctl --user daemon-reload
systemctl --user enable --quiet cafe-lauren.service cafe-backup.timer
systemctl --user restart cafe-lauren.service
systemctl --user start cafe-backup.timer

# deploy/push.sh checks the app from the Mac instead, so a dropped Wi-Fi
# connection during a slow start cannot leave the push hanging.
[[ "${1:-}" == "--no-wait" ]] && exit 0

echo "==> Waiting for the app"
for _ in $(seq 1 150); do
  if curl -fsS http://localhost:8080/api/health >/dev/null 2>&1; then
    curl -fsS http://localhost:8080/api/health; echo
    echo "==> Running at http://$(hostname).local:8080"
    exit 0
  fi
  sleep 2
done
echo "The app did not answer. Recent log:" >&2
journalctl --user -u cafe-lauren.service -n 40 --no-pager >&2
exit 1
