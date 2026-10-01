#!/usr/bin/env python3
"""Open a GitHub issue for any feed that has been failing for a day, and close it on recovery.

Run by .github/workflows/update-feeds.yml after build_feeds.py. Reads the snapshot's
`failingSince` field and uses the `gh` CLI (GH_TOKEN must be set). One issue per feed,
titled "Feed failing: <name>", labelled feed-health. Standard library only.

Usage:
    python3 scripts/check_feed_health.py _site/feeds.json [--hours 24] [--dry-run]
"""

import argparse
import datetime as dt
import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_feeds import load_feed_list  # noqa: E402

LABEL = "feed-health"
TITLE = "Feed failing: {}"


def gh(*args: str) -> str:
    return subprocess.run(["gh", *args], check=True, capture_output=True, text=True).stdout


def fmt(ms: int | None) -> str:
    if not ms:
        return "unknown"
    return dt.datetime.fromtimestamp(ms / 1000, dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("snapshot")
    ap.add_argument("--hours", type=float, default=24)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    snap = json.loads(Path(args.snapshot).read_text(encoding="utf-8"))
    now_ms = time.time() * 1000
    limit_ms = args.hours * 3600 * 1000

    open_issues = {} if args.dry_run else {
        i["title"]: i["number"]
        for i in json.loads(gh("issue", "list", "--label", LABEL, "--state", "open",
                               "--limit", "200", "--json", "number,title"))
    }
    run_url = (f"{os.environ.get('GITHUB_SERVER_URL')}/{os.environ.get('GITHUB_REPOSITORY')}"
               f"/actions/runs/{os.environ.get('GITHUB_RUN_ID')}") if os.environ.get("GITHUB_RUN_ID") else ""

    for feed in load_feed_list():
        entry = snap["feeds"].get(feed["url"], {})
        title = TITLE.format(feed["name"])
        since = entry.get("failingSince")
        failing_long = not entry.get("ok") and since and now_ms - since >= limit_ms

        if failing_long and title not in open_issues:
            body = (f"**{feed['name']}** has failed every snapshot build since {fmt(since)}.\n\n"
                    f"- Feed URL: {feed['url']}\n"
                    f"- Last error: `{entry.get('error', 'unknown')}`\n"
                    f"- Last successful fetch: {fmt(entry.get('fetched'))}\n"
                    + (f"- Latest run: {run_url}\n" if run_url else "") +
                    "\nThe app keeps showing this feed's last-known stories. Fix the URL in the "
                    "`FEEDS` list in `app.js`, or remove the feed. This issue closes automatically "
                    "when the feed recovers.")
            print(f"open   {title}")
            if not args.dry_run:
                gh("issue", "create", "--title", title, "--label", LABEL, "--body", body)
        elif entry.get("ok") and title in open_issues:
            print(f"close  {title}")
            if not args.dry_run:
                gh("issue", "close", str(open_issues[title]), "--comment",
                   f"Recovered: fetched successfully at {fmt(entry.get('fetched'))}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
