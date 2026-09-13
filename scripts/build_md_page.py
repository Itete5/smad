"""Build templates/md.html from latest MD shell HTML in agent transcript."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD = ROOT / "templates" / "md.html"
TRANSCRIPT_DIR = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
)


def extract_html() -> str:
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
            msg = obj.get("message") or {}
            parts = msg.get("content") or []
            text = ""
            for block in parts:
                if isinstance(block, dict) and block.get("type") == "text":
                    text += block.get("text", "")
            raw = text
            text = re.sub(r"<timestamp>[^<]*</timestamp>\s*", "", text)
            text = re.sub(r"<user_query>\s*", "", text)
            text = re.sub(r"\s*</user_query>\s*$", "", text)
            if (
                "<!DOCTYPE html>" not in text
                or "SMAD — Molecular Dynamics Suite" not in text
                or "SRC_MDSIM" not in text
                or "activateMode" not in text
            ):
                continue
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start < 0 or end <= start:
                continue
            html = text[start : end + len("</html>")]
            score = len(html) + seq  # prefer later transcript matches when content ties
            if "SRC_FF" in html:
                score += 2_000_000
            if "SRC_MDEVO" in html:
                score += 2_000_000
            if 'id="mode-bar"' in html:
                score += 1_500_000
            if "Not implemented in this build yet" in html:
                score += 1_000_000
            if "metal units" in html:
                score += 800_000
            if "Buckingham catastrophe" in html:
                score += 500_000
            if "update MD Simulations" in raw:
                score += 5_000_000
            if score > best_score:
                best_score = score
                best = html
    if not best:
        raise SystemExit("Could not find MD shell HTML in transcript")
    return best


def fix_html(html: str) -> str:
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>SMAD — Molecular Dynamics Suite</title>\n",
            "<title>SMAD — Molecular Dynamics Suite</title>\n"
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    return html.strip() + "\n"


def main() -> None:
    html = fix_html(extract_html())
    MD.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {MD} ({html.count(chr(10)) + 1} lines, {len(html):,} bytes)")
    for s in [
        "favicon.png",
        "SRC_MDSIM",
        "SRC_FF",
        "SRC_MDEVO",
        "activateMode",
        'id="mode-bar"',
        "MD Simulations",
        "Force Field",
        "MD Evolution",
        "Monte Carlo",
        "Not implemented in this build yet",
    ]:
        print(f"  {s}: {s in html}")


if __name__ == "__main__":
    main()
