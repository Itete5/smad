"""Build templates/md_evolution.html from the latest melt-quench HTML in the agent transcript."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "templates" / "md_evolution.html"
TRANSCRIPT = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\ed8163a6-248d-42a2-bd13-4efd38dffd1a"
    r"\ed8163a6-248d-42a2-bd13-4efd38dffd1a.jsonl"
)

TITLEBAR_NAV = """<div id="titlebar">
  <a href="/" style="color:#fff;text-decoration:none;opacity:.9;font-size:12px;font-weight:500;margin-right:4px">SMAD</a>
  <span style="opacity:.5">/</span>
  <a href="/md" style="color:#fff;text-decoration:none;opacity:.9;font-size:12px;font-weight:500;margin:0 4px">MD</a>
  <span style="opacity:.5;margin-right:10px">/</span>
  <span class="ttl">MD Evolution</span>
  <span class="sub">Amorphous Structure Generator — Classical Melt-Quench Molecular Dynamics</span>
</div>"""


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
            and "mdEvoStart" in text
            and "Amorphous Structure Generator" in text
        ):
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start >= 0 and end > start:
                best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find MD Evolution HTML in transcript")
    return best


def integrate_site(html: str) -> str:
    if 'href="/static/favicon.png' not in html:
        html = html.replace(
            "<title>",
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n<title>',
            1,
        )
    html2, n = re.subn(
        r'<div id="titlebar">\s*<span class="ttl">[^<]*</span>\s*'
        r'<span class="sub">[^<]*</span>\s*</div>',
        TITLEBAR_NAV,
        html,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"titlebar rewrite failed (n={n})")
    return html2


def main() -> None:
    html = integrate_site(extract_html(TRANSCRIPT))
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
