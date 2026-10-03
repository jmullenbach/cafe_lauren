"""Weekly ad fetchers, one per store (ported from scripts/fetch_ads.py).

A fetcher finds the ad images on the store's page; `download()` saves them
under the media dir as ads/<store>/<YYYY-MM-DD>/<file>. Stores without a
fetcher (Aldi, Amazon Fresh) use manual uploads only:
POST /api/stores/{id}/ads/upload.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from typing import Protocol
from urllib.parse import urljoin, urlparse

import httpx

USER_AGENT = "Mozilla/5.0 (compatible; CafeLauren/1.0; household meal planner)"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


class NoAdFetcher(Exception):
    """The store has no automatic ad reader; upload photos of the ad instead."""


class _Links(HTMLParser):
    """Collect img src/data-src and a href values (what fetch_ads.py read with BeautifulSoup)."""

    def __init__(self) -> None:
        super().__init__()
        self.urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k: v or "" for k, v in attrs}
        if tag == "img":
            self.urls.append(a.get("src") or a.get("data-src") or "")
        elif tag == "a":
            self.urls.append(a.get("href", ""))


def page_urls(html: str) -> list[str]:
    p = _Links()
    p.feed(html)
    return [u for u in p.urls if u]


class AdFetcher(Protocol):
    store_key: str

    def image_urls(self, html: str, page_url: str) -> list[str]: ...


@dataclass
class CermakFetcher:
    """Cermak Produce posts its flyer as images named like Cermak4_1_092426.jpg."""

    store_key: str = "cermak"
    pattern: re.Pattern[str] = re.compile(r"Cermak\d+_\d+_\d+\.(jpg|jpeg|png)", re.IGNORECASE)

    def image_urls(self, html: str, page_url: str) -> list[str]:
        out: list[str] = []
        for u in page_urls(html):
            if self.pattern.search(u):
                full = _absolute(u, page_url)
                if full not in out:
                    out.append(full)
        return out


FETCHERS: dict[str, AdFetcher] = {"cermak": CermakFetcher()}


def fetcher_for(store_key: str) -> AdFetcher | None:
    return FETCHERS.get(store_key)


def _absolute(u: str, page_url: str) -> str:
    if u.startswith("//"):
        return "https:" + u
    return urljoin(page_url, u)


def _filename(url: str, i: int) -> str:
    name = Path(urlparse(url).path).name
    if not name or Path(name).suffix.lower() not in IMAGE_EXTS:
        name = f"ad_page_{i}.jpg"
    return re.sub(r"[^A-Za-z0-9._-]", "_", name)


async def download(store_key: str, ads_url: str | None, media_dir: Path, *, on: date | None = None,
                   client: httpx.AsyncClient | None = None) -> list[str]:
    """Fetch the store's ad page and save its flyer images. Returns media-relative paths."""
    fetcher = fetcher_for(store_key)
    if fetcher is None or not ads_url:
        raise NoAdFetcher(f"No automatic ad reader for {store_key}. Upload photos of the ad instead.")
    own = client is None
    client = client or httpx.AsyncClient(timeout=30, follow_redirects=True, headers={"User-Agent": USER_AGENT})
    try:
        resp = await client.get(ads_url)
        resp.raise_for_status()
        urls = fetcher.image_urls(resp.text, str(resp.url))
        if not urls:
            raise RuntimeError(f"No ad images found on {ads_url}. The page may have changed; upload photos instead.")
        folder = Path("ads") / store_key / (on or date.today()).isoformat()
        (media_dir / folder).mkdir(parents=True, exist_ok=True)
        saved = []
        for i, url in enumerate(urls, 1):
            r = await client.get(url)
            r.raise_for_status()
            rel = folder / _filename(url, i)
            (media_dir / rel).write_bytes(r.content)
            saved.append(rel.as_posix())
        return saved
    finally:
        if own:
            await client.aclose()
