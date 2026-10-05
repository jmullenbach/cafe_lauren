#!/usr/bin/env bash
# Copy the Pi's logs and network settings off its SD card, for when the Pi boots
# but never appears on the network and there is no screen to look at.
# Put the card in this Mac first. Reads only; nothing on the card is changed.
# Asks for your Mac password (reading the Linux partition needs it).
#
#   deploy/read-pi-logs.sh disk4
#
# Needs: brew install e2fsprogs
set -euo pipefail

DISK="${1:?usage: read-pi-logs.sh diskN}"
DEBUGFS="/opt/homebrew/opt/e2fsprogs/sbin/debugfs"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/data/pi-logs"

[[ -x "$DEBUGFS" ]] || { echo "Run: brew install e2fsprogs" >&2; exit 1; }
diskutil info "$DISK" | grep -q "Protocol: *Secure Digital" || { echo "$DISK is not an SD card. Stopping." >&2; exit 1; }

rm -rf "$OUT" && mkdir -p "$OUT"
for path in /var/log /etc/netplan /etc/NetworkManager /etc/sudoers.d /etc/hostname; do
  sudo "$DEBUGFS" -R "rdump $path $OUT" "/dev/r${DISK}s2" 2>>"$OUT/debugfs-errors.txt" || true
done
sudo chown -R "$(id -u):$(id -g)" "$OUT"
chmod -R u+rwX "$OUT"
cp /Volumes/bootfs/network-config /Volumes/bootfs/user-data /Volumes/bootfs/meta-data /Volumes/bootfs/cmdline.txt "$OUT/" 2>/dev/null || true
echo "Saved to $OUT"
