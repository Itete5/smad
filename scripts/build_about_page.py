"""Build templates/about.html from latest About HTML in agent transcript."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
ABOUT = ROOT / "templates" / "about.html"
TRANSCRIPT_DIR = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
)


def extract_html() -> str:
    best = None
    for transcript_path in TRANSCRIPT_DIR.rglob("*.jsonl"):
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
            text = re.sub(r"<user_query>\s*", "", text)
            text = re.sub(r"\s*</user_query>\s*$", "", text)
            if (
                "<!DOCTYPE html>" in text
                and "About · SMAD" in text
                and "showTab('platform'" in text
                and "DESIGN TOKENS — dark platform theme" in text
            ):
                start = text.find("<!DOCTYPE html>")
                end = text.rfind("</html>")
                if start >= 0 and end > start:
                    best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find About HTML in transcript")
    return best


def fix_html(html: str) -> str:
    # Prefer known SMAD GitHub link if present as bare github.com
    html = html.replace(
        'href="https://github.com" target="_blank"',
        'href="https://github.com/Itete5/smad" target="_blank"',
    )
    # Contact should match site patterns
    html = html.replace('href="/contact"', 'href="/about#contact"')
    return html.strip() + "\n"


def main() -> None:
    html = fix_html(extract_html())
    ABOUT.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {ABOUT} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
