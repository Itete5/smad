"""Build templates/montecarlo.html from latest MC HTML in agent transcript."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "templates" / "montecarlo.html"
TRANSCRIPT = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\ed8163a6-248d-42a2-bd13-4efd38dffd1a"
    r"\ed8163a6-248d-42a2-bd13-4efd38dffd1a.jsonl"
)


def extract_html(transcript_path: pathlib.Path) -> str:
    best = None
    for line in transcript_path.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("role") != "user":
            continue
        msg = obj.get("message") or {}
        parts = msg.get("content") or []
        text = ""
        for block in parts:
            if isinstance(block, dict) and block.get("type") == "text":
                text += block.get("text", "")
        text = re.sub(r"<timestamp>[^<]*</timestamp>\s*", "", text)
        if (
            "<!DOCTYPE html>" in text
            and "SMAD — Monte Carlo" in text
            and "btnGenerate" in text
            and "/api/mc/start" in text
        ):
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start >= 0 and end > start:
                best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find Monte Carlo HTML in transcript")
    return best


def integrate_site(html: str) -> str:
    if 'href="/static/favicon.png' not in html:
        html = html.replace(
            "<title>",
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png" />\n<title>',
            1,
        )
    html = html.replace(
        '<div class="home-tab">⌂ SMAD Home</div>',
        '<a href="/" class="home-tab">⌂ SMAD Home</a>',
        1,
    )
    html = re.sub(
        r"\.home-tab\{([^}]*)\}",
        r".home-tab{\1text-decoration:none;}",
        html,
        count=1,
    )
    html = html.replace(
        "text-decoration:none;text-decoration:none;",
        "text-decoration:none;",
    )
    if ".home-tab:hover" not in html:
        html = html.replace(
            ".home-tab{text-decoration:none;}",
            ".home-tab{text-decoration:none;}\n  .home-tab:hover{background:#d8d8d8;color:#333;}",
            1,
        )
    return html


def main() -> None:
    html = integrate_site(extract_html(TRANSCRIPT))
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
