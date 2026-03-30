"""Extract latest CrystalForge HTML from Cursor transcript JSONL; apply SMAD patches."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRANSCRIPT_ROOT = Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
)
OUT = ROOT / "static" / "crystalforge.html"


def main() -> None:
    for jf in sorted(TRANSCRIPT_ROOT.rglob("*.jsonl"), key=lambda x: x.stat().st_mtime, reverse=True):
        for line in jf.open(encoding="utf-8"):
            if "Update again CrystalForge" not in line or "<!DOCTYPE html>" not in line:
                continue
            obj = json.loads(line)
            text = obj["message"]["content"][0]["text"]
            if "<user_query>" in text:
                text = text.split("<user_query>", 1)[1]
            if "</user_query>" in text:
                text = text.split("</user_query>", 1)[0]
            m = re.search(r"(<!DOCTYPE html>.*</html>)", text, re.DOTALL)
            if not m:
                raise SystemExit(f"No HTML block in transcript line (len={len(text)})")
            html = m.group(1)
            html = html.replace(
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
                '  <link rel="icon" href="/static/favicon.png?v=atom" type="image/png">',
                1,
            )
            html = html.replace(
                "    </div>\n"
                '    <div class="nav-divider"></div>\n'
                '    <div class="nav-tabs">',
                "    </div>\n"
                '    <a href="/" class="ntab" style="text-decoration:none;margin-right:2px" '
                'title="SMAD platform home">⌂ Home</a>\n'
                '    <div class="nav-divider"></div>\n'
                '    <div class="nav-tabs">',
                1,
            )
            OUT.write_text(html, encoding="utf-8")
            print("Wrote", OUT, OUT.stat().st_size)
            return
    raise SystemExit("No matching transcript line found")


if __name__ == "__main__":
    main()
