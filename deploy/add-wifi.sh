#!/usr/bin/env bash
# Add home Wi-Fi to a freshly flashed Pi card that is mounted on this Mac as "bootfs".
# Reads the network name and password from deploy/pi-firstboot/wifi.env.
# The password is stored on the card as a WPA key hash, not as plain text.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BOOT="/Volumes/bootfs"
[[ -f "$BOOT/user-data" ]] || { echo "The Pi card is not mounted at $BOOT. Put it in the Mac first." >&2; exit 1; }

python3 - "$HERE/pi-firstboot/wifi.env" "$BOOT/network-config" <<'PY'
import hashlib, json, sys
vals = {}
for line in open(sys.argv[1], encoding="utf-8"):
    if "=" in line and not line.lstrip().startswith("#"):
        k, v = line.rstrip("\n").split("=", 1)
        vals[k.strip()] = v.strip()
ssid, pw = vals.get("WIFI_SSID", ""), vals.get("WIFI_PASSWORD", "")
if not ssid or not 8 <= len(pw) <= 63:
    sys.exit("Fill in WIFI_SSID and WIFI_PASSWORD (8 to 63 characters) in deploy/pi-firstboot/wifi.env first.")
psk = hashlib.pbkdf2_hmac("sha1", pw.encode(), ssid.encode(), 4096, 32).hex()
open(sys.argv[2], "w", encoding="utf-8").write(f"""network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
      optional: true
  wifis:
    wlan0:
      dhcp4: true
      optional: true
      regulatory-domain: "US"
      access-points:
        {json.dumps(ssid)}:
          password: "{psk}"
""")
print(f"Wi-Fi network {ssid!r} written to the card.")
PY

# Make sure first-boot setup runs again if the Pi was already started once with this card.
sed -i '' "s/^instance_id: .*/instance_id: cafe-$(date +%s)/" "$BOOT/meta-data"
cp "$HERE/pi-firstboot/user-data" "$BOOT/user-data"
touch "$BOOT/ssh"
sync
diskutil eject "$BOOT"
echo "Done. Put the card in the Pi and power it on."
