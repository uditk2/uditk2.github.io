#!/usr/bin/env python3
"""Sync Medium posts into the site.

Medium's RSS feed only exposes the latest ~10 posts, so the total can't be read
from it. Instead:
  - assets/articles.json accumulates every post the feed has shown us (the list).
  - assets/site.json holds the total as of `countedThrough`. Each post published
    after that moment adds 1 to the total, and the moment moves forward.
Idempotent: running twice never double counts. Never fails the deploy on a
network or parse error.
"""
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "assets" / "site.json"
ARTICLES = ROOT / "assets" / "articles.json"
FEED_URL = "https://medium.com/feed/@uditk2"
UA = "Mozilla/5.0 (compatible; uditk2-site-sync/1.0)"


def clean_url(u):
    p = urlsplit(u.strip())
    return f"{p.scheme}://{p.netloc}{p.path}"


def fetch_feed(path=None):
    if path:
        return Path(path).read_bytes()
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def parse(xml_bytes):
    items = []
    for it in ET.fromstring(xml_bytes).iter("item"):
        title = (it.findtext("title") or "").strip()
        link = it.findtext("link") or it.findtext("guid") or ""
        pub = it.findtext("pubDate")
        if not (title and link and pub):
            continue
        dt = parsedate_to_datetime(pub)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        items.append({"title": title, "url": clean_url(link), "date": dt.astimezone(timezone.utc)})
    return items


def iso(dt):
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main(feed_path=None):
    site = json.loads(SITE.read_text())
    try:
        feed = parse(fetch_feed(feed_path))
    except Exception as e:  # keep the deploy green
        print(f"sync skipped: {e}")
        return 0
    if not feed:
        print("sync skipped: empty feed")
        return 0

    counted_through = datetime.fromisoformat(site["countedThrough"].replace("Z", "+00:00")) \
        if site.get("countedThrough") else datetime.now(timezone.utc)

    # Count posts published after the last counted moment.
    new = [i for i in feed if i["date"] > counted_through]
    if new:
        site["articles"] = int(site.get("articles", 0)) + len(new)
        counted_through = max(i["date"] for i in new)
    site["countedThrough"] = iso(counted_through)

    # Accumulate the list (newest first), minus anything hidden by title.
    hide = [h.lower() for h in site.get("hideTitles", [])]
    existing = {a["url"]: a for a in json.loads(ARTICLES.read_text()).get("items", [])} if ARTICLES.exists() else {}
    for i in feed:
        if any(h in i["title"].lower() for h in hide):
            continue
        existing[i["url"]] = {"title": i["title"], "url": i["url"], "date": iso(i["date"])}
    items = sorted(existing.values(), key=lambda a: a["date"], reverse=True)

    SITE.write_text(json.dumps(site, indent=2) + "\n")
    ARTICLES.write_text(json.dumps({"items": items}, indent=2) + "\n")
    print(f"feed items: {len(feed)}, new: {len(new)}, total: {site['articles']}, listed: {len(items)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else None))
