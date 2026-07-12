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
    best_score = -1
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
                "<!DOCTYPE html>" not in text
                or "About · SMAD" not in text
                or "showTab('platform'" not in text
                or "DESIGN TOKENS — dark platform theme" not in text
            ):
                continue
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start < 0 or end <= start:
                continue
            html = text[start : end + len("</html>")]
            score = len(html)
            if "jay-rwaka.jpg" in html:
                score += 1_000_000
            if 'id="theme-toggle"' in html:
                score += 100_000
            if score > best_score:
                best_score = score
                best = html
    if not best:
        raise SystemExit("Could not find About HTML in transcript")
    return best


def fix_html(html: str) -> str:
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>About · SMAD</title>\n",
            "<title>About · SMAD</title>\n"
            '    <link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    # Serve founder photo from static/
    html = re.sub(
        r'src=(["\'])(?:\./)?jay-rwaka\.jpg\1',
        r'src="/static/jay-rwaka.jpg"',
        html,
    )
    html = html.replace('src="jay-rwaka.jpg"', 'src="/static/jay-rwaka.jpg"')
    html = html.replace("src='jay-rwaka.jpg'", 'src="/static/jay-rwaka.jpg"')
    # Prefer known SMAD GitHub link if present as bare github.com
    html = html.replace(
        'href="https://github.com" target="_blank"',
        'href="https://github.com/Itete5/smad" target="_blank"',
    )
    html = html.replace('href="smad_home.html"', 'href="/"')
    # Contact should match site patterns
    html = html.replace('href="/contact"', 'href="/about#contact"')
    return html.strip() + "\n"


def main() -> None:
    html = fix_html(extract_html())
    ABOUT.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {ABOUT} ({html.count(chr(10)) + 1} lines, {len(html):,} bytes)")
    for s in [
        "favicon.png",
        "/static/jay-rwaka.jpg",
        'id="theme-toggle"',
        "panel-team",
        "Creator, SMAD",
    ]:
        print(f"  {s}: {s in html}")


if __name__ == "__main__":
    main()
