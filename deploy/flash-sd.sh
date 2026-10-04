#!/usr/bin/env bash
# Erase an SD card and write Raspberry Pi OS to it, set up for a first boot with no screen.
# Asks for your Mac password once (writing to a raw disk needs it).
#
#   deploy/flash-sd.sh disk4 ~/.cache/cafe-lauren/raspios-trixie-arm64-lite-2026-09-15.img
#
# EVERYTHING ON THE CARD IS DESTROYED.
set -euo pipefail

DISK="${1:?usage: flash-sd.sh diskN image.img}"
IMG="${2:?usage: flash-sd.sh diskN image.img}"
HERE="$(cd "$(dirname "$0")" && pwd)"
INFO="$(diskutil info "$DISK")"

# Refuse anything that is not a removable SD card.
echo "$INFO" | grep -q "Protocol: *Secure Digital" || { echo "$DISK is not an SD card. Stopping." >&2; exit 1; }
echo "$INFO" | grep -q "Removable Media: *Removable" || { echo "$DISK is not removable. Stopping." >&2; exit 1; }
[[ -f "$IMG" ]] || { echo "Image not found: $IMG" >&2; exit 1; }

echo "About to erase this card:"
echo "$INFO" | grep -E "Device Node|Media Name|Disk Size"
diskutil list "$DISK" | tail -n +2
read -r -p "Type ERASE to continue: " answer
[[ "$answer" == "ERASE" ]] || { echo "Cancelled."; exit 1; }

diskutil unmountDisk "/dev/$DISK"
echo "==> Writing the image (about 3 GB, a few minutes; press Ctrl+T for progress)"
sudo dd if="$IMG" of="/dev/r$DISK" bs=4m
sync

echo "==> Adding first-boot settings"
for _ in $(seq 1 30); do [[ -d /Volumes/bootfs ]] && break; sleep 1; done
[[ -d /Volumes/bootfs ]] || diskutil mount "/dev/${DISK}s1"
cp "$HERE/pi-firstboot/user-data" /Volumes/bootfs/user-data
touch /Volumes/bootfs/ssh
sync
diskutil eject "/dev/$DISK"
echo "==> Done. Put the card in the Pi, plug in Ethernet, then power."
