"""Build templates/index.html from latest homepage HTML in agent transcript."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = ROOT / "templates" / "index.html"
TRANSCRIPT = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4.jsonl"
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
        text = re.sub(r"<user_query>\s*", "", text)
        text = re.sub(r"\s*</user_query>\s*$", "", text)
        if (
            "<!DOCTYPE html>" in text
            and "#0d0a06" in text
            and "NAV — exactly 5 links" in text
            and ("Community — inline" in text or 'class="comm-header"' in text)
        ):
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start >= 0 and end > start:
                best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find homepage HTML in transcript")
    return best


def fix_html(html: str) -> str:
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>SMAD · Superconducting Materials Automated Discovery</title>\n",
            "<title>SMAD · Superconducting Materials Automated Discovery</title>\n"
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    html = re.sub(
        r'src="/static/community_ideas\.html\?v=[^"]+"',
        'src="/static/community_ideas.html?v={{ community_iframe_v }}"',
        html,
        count=1,
    )
    return html.strip() + "\n"


def main() -> None:
    html = fix_html(extract_html(TRANSCRIPT))
    INDEX.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {INDEX} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
