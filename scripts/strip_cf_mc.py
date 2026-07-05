"""Remove CrystalForge and Monte Carlo from templates/md.html."""
import re
import pathlib

MD = pathlib.Path(__file__).resolve().parents[1] / "templates" / "md.html"
html = MD.read_text(encoding="utf-8")
n0 = len(html)


def remove_between(text: str, start: str, end: str, keep_end: bool = False, label: str = "") -> str:
    i = text.find(start)
    if i < 0:
        print(f"  skip: {label or start[:40]!r}")
        return text
    j = text.find(end, i)
    if j < 0:
        raise SystemExit(f"end missing for {label or start[:40]!r}")
    j2 = j if keep_end else j + len(end)
    print(f"  removed: {label or start[:40]!r} ({j2 - i} chars)")
    return text[:i] + text[j2:]


# ── CSS ──────────────────────────────────────────────────────
html = remove_between(
    html,
    "/* ══════════════════════════════════════════════════════\n   MONTE CARLO MODE — Metropolis-based structure search,\n   standalone sibling to Evolution / MD Evolution.\n   Overlays the workspace when mode=mc\n   ══════════════════════════════════════════════════════ */",
    "#mcevo-top::-webkit-scrollbar{height:4px}\n",
    label="css mcevo workspace",
)
html = remove_between(
    html,
    "/* ══════════════════════════════════════════════════════════\n   DESIGN TOKENS — inherited from CrystalForge\n══════════════════════════════════════════════════════════ */\n\n",
    "",
    label="css crystalforge tokens comment",
)
html = html.replace(
    "#mdevo-overlay,#mcevo-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:900;background:#e8e8e8;display:none;flex-direction:column;overflow:hidden;}",
    "#mdevo-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:900;background:#e8e8e8;display:none;flex-direction:column;overflow:hidden;}",
)
html = html.replace(
    "#mdevo-overlay.active,#mcevo-overlay.active{display:flex;}",
    "#mdevo-overlay.active{display:flex;}",
)
html = html.replace(
    "/* ══ 3D VIEWER (CrystalForge engine) ══ */",
    "/* ══ 3D VIEWER ══ */",
)

# ── HTML ─────────────────────────────────────────────────────
html = re.sub(
    r'\n\s*<button class="rp-tab" data-stab="cf" onclick="switchSubTab\(\'cf\',this,\'md-sys\'\)">CrystalForge</button>',
    "",
    html,
    count=1,
)
html = remove_between(
    html,
    '          <div id="md-sys-cf" style="display:none">',
    '          <div class="field-row" style="margin-top:6px"><div class="field-label">Init T (K)</div>',
    keep_end=True,
    label="html md-sys-cf",
)
html = re.sub(
    r'\n\s*<button class="rp-tab" data-rptab="md-mc" onclick="switchRpTab\(\'md-mc\',this\)">Monte Carlo</button>',
    "",
    html,
    count=1,
)
html = remove_between(
    html,
    "    <!-- ════════════════════════════════════════════════════\n         TAB: MONTE CARLO (Metropolis Structure Search)\n    ════════════════════════════════════════════════════ -->",
    "    </div><!-- /rptab-md-mc -->\n",
    label="html rptab-md-mc",
)
html = re.sub(
    r'\n\s*<div class="mm-item" data-mode="mcevo" onclick="selectModeItem\(\'mcevo\',event\)"><span class="mm-lbl" style="color:#fb923c;font-weight:700">⬡ Monte Carlo Evolution</span></div>',
    "",
    html,
    count=1,
)
html = re.sub(
    r'\n\s*<div class="mm-item" data-mode="mc" onclick="selectModeItem\(\'mc\',event\)"><span class="mm-lbl" style="color:#ea580c;font-weight:700">⬡ Monte Carlo</span></div>',
    "",
    html,
    count=1,
)
html = remove_between(
    html,
    "<div id=\"mcevo-overlay\">",
    "</div><!-- /mcevo-overlay -->\n",
    label="html mcevo-overlay",
)

# ── JS ───────────────────────────────────────────────────────
html = remove_between(
    html,
    "  } else if(tabId==='md-mc'){\n    strip.innerHTML=`",
    "`;\n  } else if(tabId==='md-evo'){",
    keep_end=True,
    label="js switchRpTab md-mc",
)
html = html.replace(
    "'md-evo':'MD Evolution','md-mc':'Monte Carlo'",
    "'md-evo':'MD Evolution'",
)
html = html.replace(
    "['md-sys-presets','md-sys-import','md-sys-cf']",
    "['md-sys-presets','md-sys-import']",
)
html = re.sub(
    r"function mdLoadFromCF\(\)\{ mdLog\('No CrystalForge structure found in session\.','warn'\); \}\n",
    "",
    html,
    count=1,
)
html = remove_between(
    html,
    "/* ═══════════════════════════════════════════════════════════════════════\n   MONTE CARLO ENGINE — standalone Metropolis search, sibling to the",
    "/* ══════════════════════════════════════════════════════════\n   MD SIMULATIONS OVERLAY — ported standalone MD page script (namespaced md*)",
    keep_end=True,
    label="js mcevo engine",
)
html = remove_between(
    html,
    "function mcevoInitCharts(){",
    "}\n\n/* ══ MODE ROUTING PATCH ══ */",
    keep_end=True,
    label="js mcevoInitCharts",
)
html = html.replace("    ['mdevo-overlay','mcevo-overlay']", "    ['mdevo-overlay']")
html = remove_between(
    html,
    "    if (mode === 'mcevo') {",
    "    // Normal tab modes",
    keep_end=True,
    label="js mode routing mcevo",
)
html = html.replace(
    "var tabMap={'md':'md-sim','geometry':'md-geo','aiff':'md-aiff','mc':'md-mc'};",
    "var tabMap={'md':'md-sim','geometry':'md-geo','aiff':'md-aiff'};",
)
html = html.replace(
    "  ['mdevo-host-input','mcevo-host-input']",
    "  ['mdevo-host-input']",
)
html = html.replace(
    "mdLog('Designer — opens CrystalForge structure designer.','inf')",
    "mdLog('Designer — structure designer.','inf')",
)
html = remove_between(
    html,
    "<script>\n/* ══════════════════════════════════════════════════════════════\n   MONTE CARLO — Metropolis-based structure search",
    "</script>\n</body>",
    keep_end=True,
    label="js MC rpanel script",
)

MD.write_text(html, encoding="utf-8", newline="\n")
print(f"\n{MD}: {n0} -> {len(html)} bytes, {html.count(chr(10))+1} lines")
for s in ["CrystalForge", "rptab-md-mc", "mcevo-overlay", "const MC ", "mdLoadFromCF", "nba-rp-title", "mdevoRunLoop"]:
    print(f"  {s!r}: {s in html}")
