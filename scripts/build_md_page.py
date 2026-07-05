"""Build templates/md.html from latest user HTML in agent transcript."""
import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD = ROOT / "templates" / "md.html"
TRANSCRIPT = pathlib.Path(
    r"C:\Users\itete\.cursor\projects\c-smadlive\agent-transcripts"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4"
    r"\32866920-6631-4cb5-9962-7bdb4bd094a4.jsonl"
)

SHARED_UTILS_MARKER = "/* ══ Shared cluster / structure utilities (MD Evolution) ══ */"
MDEVO_JS_MARKER = "/* ══ MD EVOLUTION JS ══ */"


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
        if "<!DOCTYPE html>" in text and "nba-rp-title" in text:
            start = text.find("<!DOCTYPE html>")
            end = text.rfind("</html>")
            if start >= 0 and end > start:
                best = text[start : end + len("</html>")]
    if not best:
        raise SystemExit("Could not find user HTML in transcript")
    return best


def fix_html(html: str) -> str:
    html = re.sub(r"</style>\s*</style>", "</style>", html, count=1)
    # Malformed paste: </body></html><script>MC...</script></body></html>
    m = re.search(r"</body>\s*</html>\s*<script>([\s\S]*?)</script>\s*</body>\s*</html>\s*$", html)
    if m:
        mc_body = m.group(1)
        html = html[: m.start()] + f"<script>{mc_body}</script>\n</body>\n</html>"
    else:
        m2 = re.search(r"</html>\s*<script>([\s\S]*?)</script>\s*</body>\s*</html>\s*$", html)
        if m2:
            mc_body = m2.group(1)
            html = html[: m2.start()] + f"<script>{mc_body}</script>\n</body>\n</html>"
    return html.strip()


def inject_shared_utils(html: str, current_md: str) -> str:
    if "const CELL_VECS" in html:
        return html
    m = re.search(
        r"<script>\s*/\* ══ Shared cluster / structure utilities[\s\S]*?(?=<script>\s*/\* ══ MD EVOLUTION JS)",
        current_md,
    )
    if not m:
        m = re.search(
            rf"<script>\s*{re.escape(SHARED_UTILS_MARKER)}[\s\S]*?(?=</script>\s*<script>\s*/\* ══ MD EVOLUTION JS)",
            current_md,
        )
    if not m:
        return html
    block = m.group(0).rstrip()
    if not block.endswith("</script>"):
        block += "\n</script>"
    return html.replace(
        f"<script>\n{MDEVO_JS_MARKER}",
        block + f"\n<script>\n{MDEVO_JS_MARKER}",
        1,
    )


def inject_chart_inits(html: str) -> str:
    if "function mcevoInitCharts" not in html:
        stub = """
function mcevoInitCharts(){
  if(typeof Plotly==='undefined')return;
  const empty=[{x:[0],y:[0],type:'scatter',mode:'lines',line:{color:'#ccc'}}];
  const layout=(y,h)=>({margin:{t:4,r:6,b:28,l:48},paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{size:9,family:'JetBrains Mono'},xaxis:{title:'Step',gridcolor:'#ddd'},yaxis:{title:y,gridcolor:'#ddd'},showlegend:false,height:h});
  Plotly.react('mcevo-chart-energy',empty,layout('Ry/atom',128),{displayModeBar:false,responsive:true});
  Plotly.react('mcevo-chart-temp',empty,layout('T (K)',108),{displayModeBar:false,responsive:true});
}
"""
        html = html.replace(
            "/* ══ MODE ROUTING PATCH ══ */",
            stub + "\n/* ══ MODE ROUTING PATCH ══ */",
            1,
        )
    return html


def patch_bugs(html: str) -> str:
    html = html.replace(
        "mcevoRunLoop().catch(e=>{log('[MCEVO]",
        "mcevoRunLoop().catch(e=>{mdLog('[MCEVO]",
    )
    return html


def main():
    current = MD.read_text(encoding="utf-8")
    html = extract_html(TRANSCRIPT)
    html = fix_html(html)
    html = inject_shared_utils(html, current)
    html = inject_chart_inits(html)
    html = patch_bugs(html)
    MD.write_text(html, encoding="utf-8", newline="\n")
    print(f"Wrote {MD} ({html.count(chr(10))+1} lines, {len(html)} bytes)")
    for s in ["nba-rp-title", "Force-Field Gen", "CrystalForge", "md-mc", "CELL_VECS", "mdevoRunLoop"]:
        print(f"  {s}: {s in html or (s=='md-mc' and 'rptab-md-mc' in html)}")


if __name__ == "__main__":
    main()
