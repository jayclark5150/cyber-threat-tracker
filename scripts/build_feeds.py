#!/usr/bin/env python3
"""Build feeds.json: a snapshot of every built-in feed, fetched server-side.

Run by .github/workflows/update-feeds.yml every 15 minutes. Fetching here (instead of
in the browser) avoids CORS, the free proxies' rate limits and their 10-item cap, and
lets the app load one same-origin file instead of making 40+ proxy requests.

The feed list is read from the FEEDS:START/FEEDS:END JSON block in app.js, so there is
only one list to maintain. Tagging and priority scoring stay in app.js.

Usage:
    python3 scripts/build_feeds.py [--out feeds.json] [--previous URL_OR_PATH]

--previous points at the last published feeds.json; a feed that fails this run keeps
its previous items (marked ok: false) instead of disappearing. Standard library only.
"""

import argparse
import concurrent.futures as cf
import datetime as dt
import email.utils
import html
import json
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_ITEMS = 25
DESC_CHARS = 600
TIMEOUT = 25
USER_AGENT = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/128.0 Safari/537.36 cyber-threat-tracker-feed-builder")


def load_feed_list() -> list[dict]:
    src = (ROOT / "app.js").read_text(encoding="utf-8")
    m = re.search(r"/\*FEEDS:START\*/(.*?)/\*FEEDS:END\*/", src, re.S)
    if not m:
        sys.exit("FEEDS:START/FEEDS:END block not found in app.js")
    return json.loads(m.group(1))


# ---------- helpers ----------

class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def strip_html(s: str) -> str:
    if not s:
        return ""
    p = _TextExtractor()
    try:
        p.feed(s)
        p.close()
        text = "".join(p.parts)
    except Exception:
        text = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def parse_date(s: str | None) -> int | None:
    """RFC 822 (RSS) or ISO 8601 (Atom) -> epoch milliseconds."""
    if not s:
        return None
    s = s.strip()
    d = None
    try:
        d = email.utils.parsedate_to_datetime(s)
    except (TypeError, ValueError):
        try:
            d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
        except ValueError:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return int(d.timestamp() * 1000)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*",
    })
    last = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                body = r.read()
                if not body:
                    raise ValueError(f"empty response (HTTP {r.status})")
                return body
        except Exception as e:
            last = e
            time.sleep(2)
    raise last


# ---------- parsers ----------

def _local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def _child_text(node, *names) -> str:
    for name in names:
        for child in node:
            if _local(child.tag) == name and (child.text or "").strip():
                return child.text.strip()
    return ""


def _atom_link(node) -> str:
    links = [c for c in node if _local(c.tag) == "link"]
    for link in links:
        if link.get("rel", "alternate") == "alternate" and link.get("href"):
            return link.get("href")
    for link in links:
        if link.get("href"):
            return link.get("href")
        if (link.text or "").strip():
            return link.text.strip()
    return ""


def parse_xml(body: bytes, fetched_ms: int) -> list[dict]:
    root = ET.fromstring(body)
    items = []
    for node in root.iter():
        if _local(node.tag) not in ("item", "entry"):
            continue
        link = _atom_link(node) or _child_text(node, "guid", "id")
        raw_desc = _child_text(node, "description", "summary", "encoded", "content")
        ts = parse_date(_child_text(node, "pubDate", "published", "updated", "date"))
        items.append({
            "title": strip_html(_child_text(node, "title")) or "(no title)",
            "link": link,
            "desc": strip_html(raw_desc)[:DESC_CHARS],
            "ts": ts or fetched_ms,
        })
    return items


def parse_kev(body: bytes, fetched_ms: int) -> list[dict]:
    """CISA Known Exploited Vulnerabilities catalog (JSON) -> items."""
    data = json.loads(body)
    vulns = sorted(data.get("vulnerabilities", []), key=lambda v: v.get("dateAdded", ""), reverse=True)
    items = []
    for v in vulns[:MAX_ITEMS]:
        cve = v.get("cveID", "")
        ransomware = v.get("knownRansomwareCampaignUse", "").lower() == "known"
        parts = [
            f"{v.get('vendorProject', '')} {v.get('product', '')}.".strip(),
            v.get("shortDescription", ""),
            f"Required action: {v.get('requiredAction', '')}" if v.get("requiredAction") else "",
            f"Federal due date: {v.get('dueDate')}." if v.get("dueDate") else "",
            "Known to be used in ransomware campaigns." if ransomware else "",
        ]
        item = {
            "title": f"{cve}: {v.get('vulnerabilityName', '')}".strip(": "),
            "link": f"https://nvd.nist.gov/vuln/detail/{cve}" if cve else "",
            "desc": " ".join(p for p in parts if p)[:DESC_CHARS],
            "ts": parse_date(f"{v.get('dateAdded')}T00:00:00Z") or fetched_ms,
            "kev": True,
        }
        if ransomware:
            item["ransomware"] = True
        items.append(item)
    return items


def build_one(feed: dict) -> dict:
    fetched_ms = int(time.time() * 1000)
    body = fetch(feed["url"])
    items = parse_kev(body, fetched_ms) if feed.get("type") == "kev" else parse_xml(body, fetched_ms)
    if not items:
        raise ValueError("feed contained no items")
    items.sort(key=lambda i: i["ts"], reverse=True)
    return {"ok": True, "fetched": fetched_ms, "items": items[:MAX_ITEMS]}


# ---------- main ----------

def load_previous(src: str | None) -> dict:
    if not src:
        return {}
    try:
        if src.startswith(("http://", "https://")):
            raw = fetch(src)
        else:
            raw = Path(src).read_bytes()
        return json.loads(raw).get("feeds", {})
    except Exception as e:
        print(f"note: no previous snapshot loaded ({e})", file=sys.stderr)
        return {}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--out", default=str(ROOT / "feeds.json"))
    ap.add_argument("--previous", help="previous feeds.json (URL or path) to carry over failed feeds")
    args = ap.parse_args()

    feeds = load_feed_list()
    previous = load_previous(args.previous)
    out = {}

    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        futures = {ex.submit(build_one, f): f for f in feeds}
        for fut in cf.as_completed(futures):
            feed = futures[fut]
            try:
                out[feed["url"]] = fut.result()
                print(f"ok    {feed['name']:<24} {len(out[feed['url']]['items']):>3} items")
            except Exception as e:
                err = f"{type(e).__name__}: {e}"[:200]
                prev = previous.get(feed["url"], {})
                out[feed["url"]] = {"ok": False, "error": err, "fetched": prev.get("fetched"),
                                    "items": prev.get("items", [])}
                print(f"FAIL  {feed['name']:<24} {err}  (kept {len(prev.get('items', []))} previous items)")

    snapshot = {
        "version": 1,
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "feeds": {f["url"]: out[f["url"]] for f in feeds},  # keep app.js order
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(snapshot, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")

    ok = sum(1 for v in out.values() if v["ok"])
    size_kb = Path(args.out).stat().st_size // 1024
    print(f"\n{ok}/{len(feeds)} feeds ok -> {args.out} ({size_kb} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
