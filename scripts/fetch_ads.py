#!/usr/bin/env python3
"""Download grocery store weekly ad flyer images.

Reads GROCERY_STORE_URL from .env to determine where to scrape.
Currently supports Cermak Produce with automatic image detection.
For other stores, manually save ad screenshots to images/ads/.

Run with: .venv/bin/python scripts/fetch_ads.py
"""

import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "images" / "ads"

load_dotenv(PROJECT_ROOT / ".env")

ADS_URL = os.getenv("GROCERY_STORE_URL", "")
GROCERY_STORE = os.getenv("GROCERY_STORE", "").lower()


def fetch_cermak_images(soup, base_url):
    """Extract ad flyer images from Cermak Produce's weekly ads page."""
    ad_pattern = re.compile(r"Cermak\d+_\d+_\d+\.(jpg|jpeg|png)", re.IGNORECASE)

    img_urls = []
    for img in soup.find_all("img"):
        src = img.get("src", "") or img.get("data-src", "")
        if ad_pattern.search(src):
            img_urls.append(src)

    for a_tag in soup.find_all("a"):
        href = a_tag.get("href", "")
        if ad_pattern.search(href):
            img_urls.append(href)

    return img_urls


def fetch_generic_images(soup, base_url):
    """Extract likely ad/flyer images from a generic grocery store page."""
    img_urls = []
    for img in soup.find_all("img"):
        src = img.get("src", "") or img.get("data-src", "")
        if src and any(ext in src.lower() for ext in (".jpg", ".jpeg", ".png")):
            # Skip tiny images (icons, logos) by checking for common ad keywords
            alt = (img.get("alt", "") or "").lower()
            if any(kw in src.lower() or kw in alt for kw in ("ad", "flyer", "weekly", "sale", "circular")):
                img_urls.append(src)

    return img_urls


def fetch_ad_images():
    """Scrape the grocery store ads page and download all flyer images."""
    if not ADS_URL:
        print("No GROCERY_STORE_URL set in .env")
        print("Run /setup to configure your grocery store, or manually save ad images to images/ads/")
        return []

    print(f"Fetching weekly ads from {ADS_URL}...")
    resp = requests.get(ADS_URL, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    parsed = urlparse(ADS_URL)
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    if GROCERY_STORE == "cermak":
        img_urls = fetch_cermak_images(soup, base_url)
    else:
        img_urls = fetch_generic_images(soup, base_url)

    # Deduplicate while preserving order
    seen = set()
    unique_urls = []
    for url in img_urls:
        if url not in seen:
            seen.add(url)
            unique_urls.append(url)

    if not unique_urls:
        print("No ad images found. The page structure may have changed.")
        print("You can manually save ad screenshots to images/ads/ instead.")
        return []

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Clear old ads
    for old_file in OUTPUT_DIR.glob("*.jpg"):
        old_file.unlink()
    for old_file in OUTPUT_DIR.glob("*.png"):
        old_file.unlink()

    downloaded = []
    for i, url in enumerate(unique_urls, 1):
        if url.startswith("//"):
            url = "https:" + url
        elif url.startswith("/"):
            url = base_url + url

        filename = url.split("/")[-1]
        if not filename:
            filename = f"ad_page_{i}.jpg"

        filepath = OUTPUT_DIR / filename
        print(f"  Downloading {filename}...")
        try:
            img_resp = requests.get(url, timeout=30)
            img_resp.raise_for_status()
            filepath.write_bytes(img_resp.content)
            downloaded.append(filepath)
        except requests.RequestException as e:
            print(f"  Failed to download {filename}: {e}")

    print(f"\nDownloaded {len(downloaded)} ad image(s) to {OUTPUT_DIR}/")
    for f in downloaded:
        print(f"  - {f.name}")
    return downloaded


if __name__ == "__main__":
    fetch_ad_images()
