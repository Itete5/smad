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
                or "Analysis · SMAD" not in text
                or 'id="analysis-select"' not in text
                or 'id="plot-area"' not in text
                or "plotly-2.27.0.min.js" not in text
                or "renderRaman" not in text
            ):
                continue
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start < 0 or end <= start:
                continue
            html = text[start : end + len("</html>")]
            score = len(html)
            if "renderTiOSO4Structure" in html:
                score += 15_000_000
            if "buildTiOSO4Motif" in html:
                score += 14_500_000
            if "isTiOSSystem" in html:
                score += 14_000_000
            if "pickBinaryPair" in html:
                score += 13_500_000
            if 'id="viewer-toolbar"' in html:
                score += 10_000_000
            if "setWorkflowStep" in html:
                score += 9_000_000
            if "buildPolyhedraTraces" in html:
                score += 8_500_000
            if 'id="workflow"' in html:
                score += 8_000_000
            if 'html[data-theme="dark"]' in html:
                score += 7_500_000
            if "#structure-wrap.mini #structure-dims{ display:none; }" in html:
                score += 5_000_000
            if 'id="structure-wrap"' in html:
                score += 4_000_000
            if "parseElementsFromFilename" in html:
                score += 3_500_000
            if "PERIODIC_SYMBOLS" in html:
                score += 3_000_000
            if 'id="structure-dims"' in html:
                score += 1_000_000
            if "Structure viewer stays full-size" in html:
                score += 1_500_000
            if "shrinkStructureToCorner" in html:
                score += 2_000_000
            if 'id="viewport"' in html:
                score += 500_000
            if "renderXANES" in html:
                score += 250_000
            if score > best_score:
                best_score = score
                best = html
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
    print(f"Wrote {ANALYSIS} ({html.count(chr(10)) + 1} lines, {len(html):,} bytes)")
    for s in [
        "favicon.png",
        'href="/"',
        "renderTiOSO4Structure",
        "buildTiOSO4Motif",
        "isTiOSSystem",
        "pickBinaryPair",
        'id="viewer-toolbar"',
        'id="workflow"',
        "setWorkflowStep",
        "buildPolyhedraTraces",
        "toggleStructureLayer",
        'html[data-theme="dark"]',
        'id="structure-wrap"',
        "parseElementsFromFilename",
        "Plotly.Plots.resize(document.getElementById('plot-div'))",
        "max-width:820px",
    ]:
        print(f"  {s}: {s in html}")


if __name__ == "__main__":
    main()
