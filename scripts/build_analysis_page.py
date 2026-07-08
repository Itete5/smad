"""Build static/analysis_v3.html from latest Analysis HTML in agent transcript."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
ANALYSIS = ROOT / "static" / "analysis_v3.html"
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
                and "Analysis · SMAD" in text
                and 'id="analysis-select"' in text
                and "DESIGN TOKENS — BURAI palette" in text
            ):
                start = text.find("<!DOCTYPE html>")
                end = text.rfind("</html>")
                if start >= 0 and end > start:
                    best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find Analysis HTML in transcript")
    return best


def fix_html(html: str) -> str:
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>Analysis · SMAD</title>\n",
            "<title>Analysis · SMAD</title>\n"
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    html = html.replace('href="smad_home.html"', 'href="/"')
    return html.strip() + "\n"


def main() -> None:
    html = fix_html(extract_html())
    ANALYSIS.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {ANALYSIS} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
