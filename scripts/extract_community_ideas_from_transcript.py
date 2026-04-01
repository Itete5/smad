"""Extract community ideas HTML from Cursor transcript; apply SMAD favicon patch."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRANSCRIPT_ROOT = Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
)
OUT = ROOT / "static" / "community_ideas.html"


def main() -> None:
    needle = "replace ideas & Feedbacks of main page"
    for jf in sorted(TRANSCRIPT_ROOT.rglob("*.jsonl"), key=lambda x: x.stat().st_mtime, reverse=True):
        for line in jf.open(encoding="utf-8"):
            if needle not in line or "<!DOCTYPE html>" not in line:
                continue
            obj = json.loads(line)
            text = obj["message"]["content"][0]["text"]
            if "<user_query>" in text:
                text = text.split("<user_query>", 1)[1]
            if "</user_query>" in text:
                text = text.split("</user_query>", 1)[0]
            m = re.search(r"(<!DOCTYPE html>.*</html>)", text, re.DOTALL)
            if not m:
                raise SystemExit(f"No HTML block (len={len(text)})")
            html = m.group(1)
            html = html.replace(
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
                '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">',
                1,
            )
            OUT.write_text(html, encoding="utf-8")
            print("Wrote", OUT, OUT.stat().st_size)
            return
    raise SystemExit("No matching transcript line")


if __name__ == "__main__":
    main()
