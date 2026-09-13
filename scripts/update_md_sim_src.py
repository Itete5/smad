"""Update SRC_MDSIM inside templates/md.html from latest standalone MD Simulator HTML."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD = ROOT / "templates" / "md.html"
TRANSCRIPT_DIR = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
)

MARKERS = (
    "mdEnforceWalls",
    "mdSafetyCheck",
    "md-bond-style",
    "licorice",
    "bondSticksGroup",
    'class="home-tab"',
)


def extract_md_sim() -> str:
    best = None
    best_score = -1
    seq = 0
    for transcript_path in sorted(TRANSCRIPT_DIR.rglob("*.jsonl"), key=lambda p: p.stat().st_mtime):
        for line in transcript_path.read_text(encoding="utf-8", errors="replace").splitlines():
            seq += 1
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if obj.get("role") != "user":
                continue
            text = ""
            for block in (obj.get("message") or {}).get("content") or []:
                if isinstance(block, dict) and block.get("type") == "text":
                    text += block.get("text", "")
            text = re.sub(r"<timestamp>[^<]*</timestamp>\s*", "", text)
            text = re.sub(r"<user_query>\s*", "", text)
            text = re.sub(r"\s*</user_query>\s*$", "", text)
            # Standalone MD Simulator dump (not the suite shell)
            if "SRC_MDSIM" in text or "Molecular Dynamics Suite" in text:
                continue
            if "<!DOCTYPE html>" not in text or "MD Simulator" not in text:
                continue
            if not all(m in text for m in MARKERS):
                continue
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start < 0 or end <= start:
                continue
            html = text[start : end + len("</html>")]
            score = len(html) + seq
            if score > best_score:
                best_score = score
                best = html
    if not best:
        raise SystemExit("Could not find updated MD Simulator HTML in transcript")
    return best


def fix_for_iframe(html: str) -> str:
    # Navigate the top window, not the iframe, when Home is clicked.
    html = html.replace(
        '<a href="/" class="home-tab" title="SMAD Home">',
        '<a href="/" class="home-tab" title="SMAD Home" target="_top">',
        1,
    )
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>MD Simulator</title>\n",
            "<title>MD Simulator</title>\n"
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    return html


def to_js_string(html: str) -> str:
    # Match the existing SRC_* literal style used in md.html.
    escaped = (
        html.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r\n", "\n")
        .replace("\r", "\n")
        .replace("\n", "\\n")
        .replace("</script>", "<\\/script>")
    )
    return f'const SRC_MDSIM = "{escaped}";'


def replace_src_mdsim(shell: str, new_const: str) -> str:
    start = shell.find("const SRC_MDSIM = ")
    end = shell.find("\nconst SRC_FF")
    if start < 0 or end < 0 or end <= start:
        raise SystemExit("Could not locate SRC_MDSIM / SRC_FF boundaries in md.html")
    return shell[:start] + new_const + shell[end:]


def main() -> None:
    sim = fix_for_iframe(extract_md_sim())
    shell = MD.read_text(encoding="utf-8")
    updated = replace_src_mdsim(shell, to_js_string(sim))
    MD.write_text(updated, encoding="utf-8", newline="\n")
    print(f"Updated SRC_MDSIM in {MD}")
    print(f"  sim bytes: {len(sim):,}")
    for m in MARKERS + ("mdEnforceWalls", "Open box", "target=\"_top\""):
        print(f"  {m}: {m in sim or m in updated}")


if __name__ == "__main__":
    main()
