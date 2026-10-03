"""Spike: Instacart products_link on the DEV host. Needs INSTACART_API_KEY in .env.
Run: uv run --python 3.12 --with requests --with python-dotenv python spikes/instacart_spike.py
Then open the printed URL on a phone; note whether it matches products and the cart is usable.
Also tries ?retailer_key=<key> for candidate keys (edit RETAILER_KEYS)."""
import json, os, sys
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
key = os.getenv("INSTACART_API_KEY")
if not key:
    sys.exit("pending: no INSTACART_API_KEY in .env")
BASE = os.getenv("INSTACART_BASE", "https://connect.dev.instacart.tools")
RETAILER_KEYS = ["aldi", "cermak-produce", "cermak"]  # guesses; real keys come from the retailers endpoint/docs

body = {"title": "Cafe Lauren spike", "link_type": "shopping_list", "expires_in": 1,
        "line_items": [
            {"name": "boneless skinless chicken thighs", "quantity": 2.5, "unit": "pound", "display_text": "2.5 lbs chicken thighs"},
            {"name": "broccoli", "quantity": 2, "unit": "each", "display_text": "2 heads broccoli"},
            {"name": "penne pasta", "quantity": 1, "unit": "pound", "display_text": "1 lb penne"}]}
r = requests.post(f"{BASE}/idp/v1/products/products_link", json=body, timeout=30,
                  headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "Accept": "application/json"})
print(r.status_code, json.dumps(r.json() if r.headers.get("content-type", "").startswith("application/json") else r.text)[:600])
url = r.json().get("products_link_url") if r.ok else None
if url:
    print("OPEN THIS:", url)
    for rk in RETAILER_KEYS:
        print(f"  with retailer {rk}: {url}{'&' if '?' in url else '?'}retailer_key={rk}")
    # Retailer key discovery (may need a different endpoint/permission):
    rr = requests.get(f"{BASE}/idp/v1/retailers", params={"postal_code": "60608", "country_code": "US"},
                      headers={"Authorization": f"Bearer {key}"}, timeout=30)
    print("retailers:", rr.status_code, rr.text[:600])
