"""Restore Monte Carlo + Monte Carlo Evolution sections from bdab997 into current md.html."""
import re
import subprocess
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD = ROOT / "templates" / "md.html"

SRC = subprocess.check_output(
    ["git", "show", "bdab997:templates/md.html"], cwd=ROOT, text=True, encoding="utf-8"
)
html = MD.read_text(encoding="utf-8")


def between(text: str, start: str, end: str, keep_end: bool = False) -> str:
    i = text.find(start)
    if i < 0:
        raise SystemExit(f"start not found: {start[:60]!r}")
    j = text.find(end, i + len(start))
    if j < 0:
        raise SystemExit(f"end not found after {start[:60]!r}")
    j2 = j if keep_end else j + len(end)
    return text[i:j2]


# ── Extract chunks from bdab997 ──────────────────────────────
css_mcevo = between(
    SRC,
    "/* ══════════════════════════════════════════════════════\n   MONTE CARLO MODE — Metropolis-based structure search,",
    "#mcevo-top::-webkit-scrollbar{height:4px}\n",
)
rp_tab_mc = '      <button class="rp-tab" data-rptab="md-mc" onclick="switchRpTab(\'md-mc\',this)">Monte Carlo</button>\n'
pane_mc = between(
    SRC,
    "    <!-- ════════════════════════════════════════════════════\n         TAB: MONTE CARLO (Metropolis Structure Search)",
    "    </div><!-- /rptab-md-mc -->\n",
)
mm_mcevo = '\n  <div class="mm-item" data-mode="mcevo" onclick="selectModeItem(\'mcevo\',event)"><span class="mm-lbl" style="color:#fb923c;font-weight:700">⬡ Monte Carlo Evolution</span></div>'
mm_mc = '\n  <div class="mm-item" data-mode="mc" onclick="selectModeItem(\'mc\',event)"><span class="mm-lbl" style="color:#ea580c;font-weight:700">⬡ Monte Carlo</span></div>'
overlay_mcevo = between(SRC, "<div id=\"mcevo-overlay\">", "</div><!-- /mcevo-overlay -->\n")
strip_mc_js = between(
    SRC,
    "  } else if(tabId==='md-mc'){\n    strip.innerHTML=`",
    "  } else if(tabId==='md-evo'){",
    keep_end=True,
)
js_mcevo_engine = between(
    SRC,
    "/* ═══════════════════════════════════════════════════════════════════════\n   MONTE CARLO ENGINE — standalone Metropolis search, sibling to the",
    "/* ══════════════════════════════════════════════════════════\n   MD SIMULATIONS OVERLAY — ported standalone MD page script (namespaced md*)",
    keep_end=True,
)
js_mcevo_charts = between(SRC, "function mcevoInitCharts(){", "}\n\n/* ══ MODE ROUTING PATCH ══ */", keep_end=True)
js_mc_panel = between(
    SRC,
    "<script>\n/* ══════════════════════════════════════════════════════════════\n   MONTE CARLO — Metropolis-based structure search",
    "</script>\n</body>",
)

# ── CSS ──────────────────────────────────────────────────────
html = html.replace(
    "#mdevo-top::-webkit-scrollbar{height:4px}\n\n/* ══════════════════════════════════════════════════════════\n   MD SIMULATIONS OVERLAY",
    "#mdevo-top::-webkit-scrollbar{height:4px}\n" + css_mcevo + "\n/* ══════════════════════════════════════════════════════════\n   MD SIMULATIONS OVERLAY",
    1,
)
html = html.replace(
    "#mdevo-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:900;background:#e8e8e8;display:none;flex-direction:column;overflow:hidden;}",
    "#mdevo-overlay,#mcevo-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:900;background:#e8e8e8;display:none;flex-direction:column;overflow:hidden;}",
)
html = html.replace(
    "#mdevo-overlay.active{display:flex;}",
    "#mdevo-overlay.active,#mcevo-overlay.active{display:flex;}",
)

# ── HTML ─────────────────────────────────────────────────────
html = html.replace(
    '      <button class="rp-tab" data-rptab="md-evo" onclick="switchRpTab(\'md-evo\',this)">MD Evolution</button>\n    </div>',
    '      <button class="rp-tab" data-rptab="md-evo" onclick="switchRpTab(\'md-evo\',this)">MD Evolution</button>\n'
    + rp_tab_mc
    + "\n    </div>",
    1,
)
html = html.replace(
    "    </div><!-- /rptab-md-evo -->\n\n\n    </div><!-- /rp-scroll -->",
    "    </div><!-- /rptab-md-evo -->\n\n" + pane_mc + "\n    </div><!-- /rp-scroll -->",
    1,
)
html = html.replace(
    '  <div class="mm-item" data-mode="evolution" onclick="selectModeItem(\'evolution\',event)"><span class="mm-lbl" style="color:#34d399;font-weight:700">⬡ MD Evolution</span></div>\n</div>',
    '  <div class="mm-item" data-mode="evolution" onclick="selectModeItem(\'evolution\',event)"><span class="mm-lbl" style="color:#34d399;font-weight:700">⬡ MD Evolution</span></div>'
    + mm_mcevo
    + mm_mc
    + "\n</div>",
    1,
)
html = html.replace(
    "</div><!-- /mdevo-overlay -->\n</div><!-- /app -->",
    "</div><!-- /mdevo-overlay -->\n" + overlay_mcevo + "</div><!-- /app -->",
    1,
)

# ── JS switchRpTab ───────────────────────────────────────────
html = html.replace(
    "      <button onclick=\"mdLog('Training stopped.','warn')\" style=\"padding:6px 10px;border-radius:3px;background:#777;border:none;color:#fff;font-size:11px;cursor:pointer\">■ Stop</button>`;\n  } else if(tabId==='md-evo'){",
    "      <button onclick=\"mdLog('Training stopped.','warn')\" style=\"padding:6px 10px;border-radius:3px;background:#777;border:none;color:#fff;font-size:11px;cursor:pointer\">■ Stop</button>`;\n"
    + strip_mc_js,
    1,
)
html = html.replace(
    "'md-evo':'MD Evolution'",
    "'md-evo':'MD Evolution','md-mc':'Monte Carlo'",
)

# ── JS mcevo engine (before mdevoOnModeChange closing area) ──
html = html.replace(
    "/* ── Show/hide overlay when mode changes ───────────────────────────────── */\nfunction mdevoOnModeChange(mode){",
    js_mcevo_engine + "\n/* ── Show/hide overlay when mode changes ───────────────────────────────── */\nfunction mdevoOnModeChange(mode){",
    1,
)

# ── JS mcevoInitCharts + mode routing ────────────────────────
html = html.replace(
    "/* ══ MODE ROUTING PATCH ══ */",
    js_mcevo_charts + "\n/* ══ MODE ROUTING PATCH ══ */",
    1,
)
html = html.replace("    ['mdevo-overlay']", "    ['mdevo-overlay','mcevo-overlay']")
html = html.replace(
    "      if(typeof mdevoInitCharts==='function') mdevoInitCharts();\n      return;\n    }\n    // Normal tab modes",
    "      if(typeof mdevoInitCharts==='function') mdevoInitCharts();\n      return;\n    }\n"
    "    if (mode === 'mcevo') {\n"
    "      var el=document.getElementById('mcevo-overlay');\n"
    "      if(el) el.classList.add('active');\n"
    "      var lbl=document.getElementById('bb-mode-label');\n"
    "      if(lbl) lbl.textContent='Monte Carlo Evolution';\n"
    "      document.querySelectorAll('.mm-item').forEach(function(i){i.classList.toggle('active',i.dataset.mode===mode);});\n"
    "      var hi=document.getElementById('mcevo-host-input');\n"
    "      var ln=document.getElementById('md-loginNode');\n"
    "      if(hi&&ln) hi.value=ln.value;\n"
    "      if(typeof mcevoInitCharts==='function') mcevoInitCharts();\n"
    "      return;\n"
    "    }\n"
    "    // Normal tab modes",
    1,
)
html = html.replace(
    "var tabMap={'md':'md-sim','geometry':'md-geo','aiff':'md-aiff'};",
    "var tabMap={'md':'md-sim','geometry':'md-geo','aiff':'md-aiff','mc':'md-mc'};",
)
html = html.replace(
    "  ['mdevo-host-input']",
    "  ['mdevo-host-input','mcevo-host-input']",
)

# ── MC rpanel script ─────────────────────────────────────────
html = html.replace(
    "</script>\n\n</body>\n</html>",
    "</script>\n\n" + js_mc_panel + "\n</body>\n</html>",
    1,
)

MD.write_text(html, encoding="utf-8", newline="\n")
print(f"Restored MC/mcevo -> {MD} ({html.count(chr(10))+1} lines)")
for s in ["rptab-md-mc", "mcevo-overlay", "const MC ", "Monte Carlo Evolution", "CrystalForge"]:
    print(f"  {s!r}: {s in html}")
