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


HOME_CSS = """#home-tab{
  height:100%;display:flex;align-items:center;gap:6px;padding:0 14px;
  background:#ccc;color:#444;text-decoration:none;cursor:pointer;
  font-size:12px;font-weight:500;border-right:1px solid #bbb;flex-shrink:0;
}
#home-tab:hover{background:#bbb;color:#222}
#home-tab svg{flex-shrink:0}
#mode-bar-toggle{
  height:100%;display:flex;align-items:center;justify-content:flex-end;gap:8px;
  padding:0 12px;cursor:pointer;margin-left:auto;
}
#mode-bar-toggle:hover{background:#dedede}
"""

HOME_LINK = """    <a href="/" id="home-tab" title="SMAD Home">
      <svg width="14" height="14" viewBox="0 0 367 232" fill="currentColor" aria-hidden="true">
        <g transform="translate(0,232) scale(0.1,-0.1)">
          <path d="M1710 1954 c-484 -254 -619 -324 -629 -324 -7 0 -11 37 -11 110 l0
110 -155 0 -155 0 0 -198 0 -197 -287 -150 -288 -150 178 -3 c161 -2 182 -1
210 17 29 17 1034 544 1199 628 l67 35 83 -42 c46 -24 128 -66 183 -95 55 -29
240 -126 410 -215 454 -238 515 -270 570 -301 49 -27 54 -28 232 -31 99 -2
179 0 177 3 -2 4 -160 88 -351 188 -192 100 -395 206 -453 237 -208 111 -848
444 -852 444 -1 0 -59 -30 -128 -66z M1800 1662 c-19 -10 -177 -91 -350 -180
-173 -88 -394 -201 -490 -251 l-175 -90 -3 -500 -2 -501 85 0 85 0 2 451 3
451 145 74 c80 41 279 143 443 227 l298 152 197 -101 c108 -56 308 -158 445
-228 l247 -127 0 -450 0 -449 85 0 85 0 0 499 0 499 -212 110 c-339 174 -845
432 -849 432 -2 0 -20 -8 -39 -18z M1885 932 c-3 -3 -5 -70 -5 -149 l0 -143
150 0 150 0 0 28 c0 41 -53 142 -96 184 -22 20 -57 45 -79 54 -46 19 -112 34
-120 26z M1665 902 c-92 -44 -153 -126 -168 -224 l-6 -38 150 0 149 0 0 145 0
145 -32 0 c-18 0 -60 -13 -93 -28z M1490 395 l0 -145 150 0 150 0 0 145 0 145
-150 0 -150 0 0 -145z M1882 398 l3 -143 148 -3 147 -3 0 146 0 145 -150 0
-151 0 3 -142z"/>
        </g>
      </svg>
      SMAD Home
    </a>
"""


def ensure_smad_home(html: str) -> str:
    """Inject SMAD Home into the bottom mode bar if missing from transcript HTML."""
    if 'id="home-tab"' in html:
        return html

    html = html.replace(
        "display:flex;align-items:center;justify-content:flex-end;gap:8px;\n"
        "  padding:0 12px;cursor:pointer;user-select:none;\n"
        "}\n"
        "#mode-bar:hover{background:#dedede}\n",
        "display:flex;align-items:center;justify-content:space-between;gap:8px;\n"
        "  padding:0;user-select:none;\n"
        "}\n"
        + HOME_CSS,
        1,
    )

    html = html.replace(
        '  <div id="mode-bar">\n'
        '    <span id="mode-bar-label">MD Simulations</span>\n',
        '  <div id="mode-bar">\n'
        + HOME_LINK
        + '    <div id="mode-bar-toggle">\n'
        '      <span id="mode-bar-label">MD Simulations</span>\n',
        1,
    )
    # close the toggle wrapper before mode-menu
    html = html.replace(
        '      <div id="mode-bar-close">×</div>\n'
        "    </div>\n"
        "  </div>\n\n"
        '  <div id="mode-menu">',
        '      <div id="mode-bar-close">×</div>\n'
        "    </div>\n"
        "    </div>\n"
        "  </div>\n\n"
        '  <div id="mode-menu">',
        1,
    )
    html = html.replace(
        "document.getElementById('mode-bar').addEventListener('click', (e) => {\n"
        "  e.stopPropagation();\n"
        "  toggleModeMenu();\n"
        "});",
        "document.getElementById('mode-bar-toggle').addEventListener('click', (e) => {\n"
        "  e.stopPropagation();\n"
        "  toggleModeMenu();\n"
        "});\n"
        "document.getElementById('home-tab').addEventListener('click', (e) => {\n"
        "  e.stopPropagation();\n"
        "});",
        1,
    )
    return html


def fix_html(html: str) -> str:
    if 'rel="icon"' not in html:
        html = html.replace(
            "<title>SMAD — Molecular Dynamics Suite</title>\n",
            "<title>SMAD — Molecular Dynamics Suite</title>\n"
            '<link rel="icon" href="/static/favicon.png?v=atom" type="image/png">\n',
            1,
        )
    html = ensure_smad_home(html)
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
        'id="home-tab"',
        "SMAD Home",
    ]:
        print(f"  {s}: {s in html}")


if __name__ == "__main__":
    main()
