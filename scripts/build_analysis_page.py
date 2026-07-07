"""Build static/analysis_v3.html from latest Analysis HTML in agent transcript."""
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
ANALYSIS = ROOT / "static" / "analysis_v3.html"
TRANSCRIPT = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4.jsonl"
)
RENDER_JS_REF = "7e61938:static/analysis_v3.html"


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
            and "Analysis · SMAD" in text
            and 'id="module-select"' in text
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
    # Malformed placeholder panes: extra closing </div>
    html = re.sub(
        r"(</div>\s*</div>)\s*</div>\s*(?=<div class=\"ppane\")",
        r"\1\n      ",
        html,
    )
    return html


def render_js_from_ref() -> str:
    old = subprocess.check_output(
        ["git", "show", RENDER_JS_REF],
        text=True,
        encoding="utf-8",
        errors="replace",
        cwd=ROOT,
    )
    m = re.search(r"function buildTabs", old)
    if not m:
        raise SystemExit("Could not find buildTabs in reference analysis HTML")
    start = m.start()
    m2 = re.search(r"/\* ── Init ── \*/", old[start:])
    end = start + m2.start() if m2 else old.rfind("</script>")
    return old[start:end].strip()


def merge_render_js(html: str) -> str:
    if "function renderActive" in html:
        return html
    block = render_js_from_ref()
    marker = "function loadSampleData(_m) { dzLoadSample(); }"
    if marker not in html:
        raise SystemExit("Could not find drop-zone script anchor for render JS merge")
    return html.replace(marker, marker + "\n\n" + block, 1)


def main() -> None:
    html = merge_render_js(fix_html(extract_html(TRANSCRIPT)))
    ANALYSIS.write_text(html.strip() + "\n", encoding="utf-8", newline="\n")
    print(f"Wrote {ANALYSIS} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
