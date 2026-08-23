"""Replace MD Evolution overlay + engine in templates/md.html with
the latest melt-quench Amorphous Structure Generator HTML from the transcript.
"""
from __future__ import annotations

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
                or "Amorphous Structure Generator" not in text
                or "mdEvoStart" not in text
                or "mdevo-chart-rdf" not in text
            ):
                continue
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start < 0 or end <= start:
                continue
            html = text[start : end + len("</html>")]
            score = len(html)
            if "Lennard-Jones" in html:
                score += 5_000_000
            if "mdEvoBerendsen" in html:
                score += 2_000_000
            if score > best_score:
                best_score = score
                best = html
    if not best:
        raise SystemExit("Could not find MD Evolution melt-quench HTML in transcript")
    return best


def extract_style(html: str) -> str:
    m = re.search(r"<style>([\s\S]*?)</style>", html)
    if not m:
        return ""
    css = m.group(1)
    # Drop full-page chrome that would fight the MD shell
    for drop in (
        r"html,body\{[^}]*\}",
        r"#app\{[^}]*\}",
        r"#console-area\{[^}]*\}",
        r"#console-area\.open\{[^}]*\}",
        r"#console-out\{[^}]*\}",
        r"#bottombar\{[^}]*\}",
        r"#console-btn\{[^}]*\}",
        r"#console-btn:hover\{[^}]*\}",
        r"\*,\*::before,\*::after\{[^}]*\}",
        r"button\{[^}]*\}",
        r"input,select,textarea\{[^}]*\}",
        r"::-webkit-scrollbar\{[^}]*\}",
        r"::-webkit-scrollbar-thumb\{[^}]*\}",
        r":focus\{[^}]*\}",
    ):
        css = re.sub(drop, "", css)
    # Overlay must fill the MD viewport when active
    css += """
#mdevo-overlay{
  position:fixed;top:0;left:0;right:0;bottom:0;z-index:900;
  background:#e8e8e8;display:none;flex-direction:column;overflow:hidden;
}
#mdevo-overlay.active{display:flex;}
#mdevo-overlay #titlebar{flex-shrink:0;}
#mdevo-overlay #mdevo-bottom{flex:1;min-height:0;}
"""
    return css


def extract_overlay_body(html: str) -> str:
    m = re.search(r'<div id="app">([\s\S]*?)</div>\s*<!--\s*/app\s*-->', html)
    if not m:
        raise SystemExit("Could not find #app body in extracted HTML")
    body = m.group(1)
    # Drop standalone console/bottom bar — MD page already has them
    body = re.sub(
        r"<!--\s*══ BOTTOM BAR / CONSOLE ══\s*-->[\s\S]*?<div id=\"bottombar\">[\s\S]*?</div>\s*",
        "",
        body,
    )
    body = re.sub(r'<div id="console-area">[\s\S]*?</div>\s*', "", body)
    body = re.sub(r'<div id="bottombar">[\s\S]*?</div>\s*', "", body)
    # Home affordance
    if "SMAD Home" not in body and 'href="/"' not in body:
        body = body.replace(
            '<div id="titlebar">\n  <span class="ttl">⬡ MD Evolution</span>',
            '<div id="titlebar">\n'
            '  <a href="/md" style="color:#fff;text-decoration:none;opacity:.9;font-size:12px;margin-right:8px">← MD</a>\n'
            '  <span class="ttl">⬡ MD Evolution</span>',
            1,
        )
    return (
        '<div id="mdevo-overlay">\n'
        + body.strip()
        + "\n</div><!-- /mdevo-overlay -->\n"
    )


def extract_script(html: str) -> str:
    m = re.search(r"<script>([\s\S]*?)</script>\s*</body>", html)
    if not m:
        raise SystemExit("Could not find main <script> in extracted HTML")
    js = m.group(1)

    # Strip declarations / helpers that already exist on the MD page
    strips = [
        r"const CF_COLORS=\{[\s\S]*?\};\n",
        r"const CF_DISPLAY_RADIUS=\{[\s\S]*?\};\n",
        r"const CF_CRADII=\{[\s\S]*?\};\n",
        r"const SYMM_CRADII = CF_CRADII;\n",
        r"const MASS=\{[\s\S]*?\};\n",
        r"const CELL_VECS_SC=\[[\s\S]*?\];\n",
        r"function evoCellFromStructure\([\s\S]*?^}\n",
        r"function evoStructureToCIF\([\s\S]*?^}\n",
        r"function evoStructureToPOSCAR\([\s\S]*?^}\n",
        r"function evoStructureToXYZ\([\s\S]*?^}\n",
        r"function evoTriggerDownload\([\s\S]*?^}\n",
        r"function symmParseFormula\([\s\S]*?^}\n",
        r"let consoleOpen=false;\n",
        r"function log\(s\)\{[\s\S]*?\}\n",
        r"function logHPC\(s\)\{[\s\S]*?\}\n",
        r"function toggleConsole\(\)\{[\s\S]*?\}\n",
        r"function sleep\(ms\)\{[\s\S]*?\}\n",
        r"window\.addEventListener\('load',\(\)=>\{\s*mdEvoInitViewer\(\);\s*\}\);\n?",
    ]
    for pat in strips:
        js = re.sub(pat, "", js, flags=re.M)

    # Use shared CELL_VECS.SC instead of removed CELL_VECS_SC
    js = js.replace("CELL_VECS_SC", "(CELL_VECS.SC||[[1,0,0],[0,1,0],[0,0,1]])")
    # Prefer existing covalent radii table
    js = js.replace("SYMM_CRADII", "CF_CRADII")

    # Mode wiring + aliases so existing MD shell keeps working
    js += """
/* ── Mode / chart aliases for MD shell ── */
function mdevoInitCharts(){ /* melt-quench charts are live-updated */ }
function mdevoStart(){ mdEvoStart(); }
function mdevoPause(){ mdEvoPause(); }
function mdevoStop(){ mdEvoStop(); }
function mdevoResetAll(){ mdEvoReset(); }
function mdevoOnModeChange(mode){
  const overlay=document.getElementById('mdevo-overlay');
  if(!overlay)return;
  if(mode==='mdevo'||mode==='evolution'){
    overlay.classList.add('active');
    mdEvoInitViewer();
  } else {
    overlay.classList.remove('active');
  }
}
"""
    return js.strip() + "\n"


def inject_css(md: str, css: str) -> str:
    marker = "/* MD EVOLUTION MELT-QUENCH CSS (auto) */"
    block = f"\n{marker}\n{css}\n/* /MD EVOLUTION MELT-QUENCH CSS */\n"
    if marker in md:
        md = re.sub(
            r"/\* MD EVOLUTION MELT-QUENCH CSS \(auto\) \*/[\s\S]*?/\* /MD EVOLUTION MELT-QUENCH CSS \*/\n?",
            block,
            md,
            count=1,
        )
    else:
        md = md.replace("</style>", block + "</style>", 1)
    return md


def replace_overlay(md: str, overlay: str) -> str:
    new_md, n = re.subn(
        r'<div id="mdevo-overlay">[\s\S]*?</div><!-- /mdevo-overlay -->\n?',
        overlay,
        md,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"Expected 1 mdevo-overlay block, found {n}")
    return new_md


def replace_engine(md: str, js: str) -> str:
    # Drop legacy population-based MD Evolution engine from shared utils script
    new_md, n1 = re.subn(
        r"\nconst MDEVO_STATUS=\{[\s\S]*?^function mdevoInitCharts\(\)\{[\s\S]*?^\}\n",
        "\n",
        md,
        count=1,
        flags=re.M,
    )
    if n1 != 1:
        raise SystemExit(f"Expected 1 legacy MDEVO engine block, found {n1}")

    # Replace old mdevo UI/start of MD EVOLUTION JS — stop before shared CIF helpers
    # (those helpers are also used by Monte Carlo Evolution).
    new_md, n2 = re.subn(
        r"/\* ══ MD EVOLUTION JS ══ \*/[\s\S]*?(?=\n/\* ── Download selected structure as CIF)",
        "/* ══ MD EVOLUTION JS — melt-quench amorphous generator ══ */\n" + js + "\n",
        new_md,
        count=1,
    )
    if n2 != 1:
        raise SystemExit(f"Expected 1 MD EVOLUTION JS UI block, found {n2}")

    # Remove obsolete host-test / download wrappers that target the old UI
    new_md, n3 = re.subn(
        r"\nfunction mdevoDownloadFmt\(fmt\)\{[\s\S]*?^\}\n",
        "\n",
        new_md,
        count=1,
        flags=re.M,
    )
    new_md, n4 = re.subn(
        r"\nasync function mdevoTestHost\(\)\{[\s\S]*?^\}\n",
        "\n",
        new_md,
        count=1,
        flags=re.M,
    )
    # Keep the melt-quench mdevoOnModeChange; do not strip it.
    # (An earlier version of this script accidentally removed the new handler.)

    # Point mode routing at the new viewer init
    new_md = new_md.replace(
        "if(typeof mdevoInitCharts==='function') mdevoInitCharts();",
        "if(typeof mdEvoInitViewer==='function') mdEvoInitViewer();"
        " else if(typeof mdevoInitCharts==='function') mdevoInitCharts();",
    )
    # Ensure any leftover population-based mdevoOnModeChange is rewritten
    new_md, n5 = re.subn(
        r"function mdevoOnModeChange\(mode\)\{\s*"
        r"const overlay=document\.getElementById\('mdevo-overlay'\);\s*"
        r"if\(mode==='mdevo'\)\{[\s\S]*?mdevoInitViewer\(\);[\s\S]*?^\}\n",
        "function mdevoOnModeChange(mode){\n"
        "  const overlay=document.getElementById('mdevo-overlay');\n"
        "  if(!overlay)return;\n"
        "  if(mode==='mdevo'||mode==='evolution'){\n"
        "    overlay.classList.add('active');\n"
        "    mdEvoInitViewer();\n"
        "  } else {\n"
        "    overlay.classList.remove('active');\n"
        "  }\n"
        "}\n",
        new_md,
        count=1,
        flags=re.M,
    )
    print(f"  stripped mdevoDownloadFmt={n3} mdevoTestHost={n4} rewritten old mdevoOnModeChange={n5}")
    return new_md


def main():
    src = extract_html()
    css = extract_style(src)
    overlay = extract_overlay_body(src)
    js = extract_script(src)

    md = MD.read_text(encoding="utf-8")
    md = inject_css(md, css)
    md = replace_overlay(md, overlay)
    md = replace_engine(md, js)
    MD.write_text(md, encoding="utf-8", newline="\n")

    print(f"Updated {MD}")
    for s in [
        "mdEvoStart",
        "mdEvoBerendsen",
        "mdevo-chart-rdf",
        "Amorphous Structure Generator",
        "Lennard-Jones",
        "mdevoOnModeChange",
        "mcevoInitCharts",
    ]:
        print(f"  {s}: {s in md}")


if __name__ == "__main__":
    main()
