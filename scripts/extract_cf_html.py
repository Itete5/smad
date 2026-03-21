"""One-off: extract CrystalForge HTML from Cursor agent transcript JSONL."""
import json
import re
from pathlib import Path

TRANSCRIPT = Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\36ae68c9-12a8-4290-a934-9c8fa75d0821\36ae68c9-12a8-4290-a934-9c8fa75d0821.jsonl"
)
OUT = Path(__file__).resolve().parent.parent / "templates" / "structures.html"


def main() -> None:
    for line in TRANSCRIPT.open(encoding="utf-8"):
        if "change CrystalForge to this" not in line:
            continue
        obj = json.loads(line)
        text = obj["message"]["content"][0]["text"]
        if "<user_query>" in text:
            text = text.split("<user_query>", 1)[1]
        if "</user_query>" in text:
            text = text.split("</user_query>", 1)[0]
        text = text.replace("change CrystalForge to this:", "", 1).strip()
        m = re.search(r"(<!DOCTYPE html>.*</html>)", text, re.DOTALL)
        if not m:
            raise SystemExit(f"No HTML match; text len={len(text)}")
        html = m.group(1)
        html = html.replace('id="center" id="main-content"', 'id="main-content"')
        html = html.replace("#center{", "#main-content{")
        html = html.replace(
            "<title>CrystalForge · Crystal Structure Discovery</title>",
            '<title>CrystalForge · Crystal Structure Discovery</title>\n'
            '  <link rel="icon" href="/static/favicon.svg" type="image/svg+xml">',
            1,
        )
        OUT.write_text(html, encoding="utf-8")
        print("Wrote", OUT, "size", OUT.stat().st_size)
        return
    raise SystemExit("No matching transcript line")


if __name__ == "__main__":
    main()
