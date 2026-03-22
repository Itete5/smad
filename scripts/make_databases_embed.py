"""Deprecated: /databases now uses a single template (databases.html) with ?embed=1.

The embed query param hides the in-page nav via Jinja/CSS and sets window.SMAD_EMBED.
This script is kept as a no-op placeholder for any old automation that invoked it.
"""
print("make_databases_embed.py: no longer needed — use templates/databases.html with embed=True from main.py")
