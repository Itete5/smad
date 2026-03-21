"""Generate templates/databases_embed.html from databases.html (no top nav)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "templates" / "databases.html").read_text(encoding="utf-8")
# Remove top nav
out = re.sub(
    r'<nav class="top-nav">.*?</nav>\s*',
    "",
    src,
    count=1,
    flags=re.DOTALL,
)
out = out.replace("<body>", '<body class="databases-embed">', 1)
extra = """
        .databases-embed { margin: 0; }
        .databases-embed .app-container { min-height: 100vh; }
"""
out = out.replace("</style>", extra + "\n    </style>", 1)
out = out.replace(
    "<title>Materials Explorer · SMAD</title>",
    '<title>Materials Explorer · SMAD</title>\n    <meta name="robots" content="noindex">',
    1,
)
(ROOT / "templates" / "databases_embed.html").write_text(out, encoding="utf-8")
print("OK", len(out))
