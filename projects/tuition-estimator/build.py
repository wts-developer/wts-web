#!/usr/bin/env python3
"""Build for the WTS tuition estimator mockup.

Inputs (src/):
  calculator.css / calculator.body.html / calculator.js
      — the cost estimator, extracted verbatim from the Apps Script
        prototype (see README for how to re-extract after changes)
  wts-tuition-page.html
      — the live wts.edu tuition page, captured as-is (Webflow export)

Outputs (dist/):
  wts-cost-estimator.js      — single-file embeddable widget (Shadow DOM)
  index.html                 — clickable mockup: captured tuition page with
                               the widget injected after the hero
  calculator-standalone.html — the estimator on its own page (parity with
                               the Apps Script original)

Standard library only. Run with: python3 build.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
read = lambda p: (ROOT / p).read_text()

css = read("src/calculator.css")
body_html = read("src/calculator.body.html")
logic_src = read("src/calculator.js")
captured_page = read("src/wts-tuition-page.html")

# Lato is the calculator's UI face, matching the rest of wts.edu. Kepler
# (headline serif) is already served site-wide by wts.edu's Typekit kit.
FONTS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Lato:wght@300;400;700;900&display=swap"
)

# ---------------------------------------------------------------------
# 1. CSS: rescope from a standalone document to a Shadow DOM widget
# ---------------------------------------------------------------------

EMBED_CSS = """
/* --- embed-mode additions (not part of the standalone page) --- */
:host { display: block; }
/* The standalone page has its own hero; the embed shows the centered
   section header instead. */
.wts-estimator-app .calculator-header { display: block; }
/* The embed shows only the interactive estimator: program cards, financial
   information, estimated cost, and the cost & scholarship mix. The host page
   supplies its own hero, and the long-form summary / per-term / market
   comparison sections stay on the standalone page only. */
.wts-estimator-app .hero,
.wts-estimator-app .full-width-summary-section,
.wts-estimator-app .full-width-term-section,
.wts-estimator-app .market-comparison-section { display: none; }
/* Keep the advanced pace options out of the embed; the start-term picker
   stays because the tuition rate increases in the June 2027 term. */
.wts-estimator-app details.advanced:not(.scholarship-reference) { display: none; }
/* wts.edu's next section overlaps upward with an angled (skewed) top edge;
   reserve room so it doesn't clip the last card of the estimator. */
.wts-estimator-app .wrap { padding-bottom: 150px; }
"""

widget_css = css.replace(":root {", ":host {", 1)
widget_css = re.sub(r"(^|[\s,{])html,\s*body\s*\{", r"\1.wts-estimator-app {", widget_css)
widget_css = re.sub(r"(^|[\s,{])body\s*\{", r"\1.wts-estimator-app {", widget_css)
widget_css = re.sub(r"(^|[\s,{])body\.program-", r"\1.wts-estimator-app.program-", widget_css)
# wts.edu's Typekit kit registers lowercase family names; try those first.
widget_css = widget_css.replace(
    '--serif: "Kepler Std Display", "Kepler Std",',
    '--serif: kepler-std-display, kepler-std, "Kepler Std Display", "Kepler Std",',
)
widget_css += EMBED_CSS

if re.search(r"(^|[\s,{])body[\s.{]", widget_css):
    raise SystemExit("unscoped body selector survived the CSS transform")

# ---------------------------------------------------------------------
# 2. JS: retarget document-level APIs at the shadow root
# ---------------------------------------------------------------------

logic = (
    logic_src.replace("document.getElementById", "root.getElementById")
    .replace("document.querySelectorAll", "root.querySelectorAll")
    .replace("document.documentElement.style.setProperty", "app.style.setProperty")
    .replace("document.body.classList", "app.classList")
)
logic = re.sub(
    r"^\s*document\.title = .*$",
    "      // embedded: leave the host page's <title> alone",
    logic,
    flags=re.M,
)

leftover = re.search(r"document\.(getElementById|querySelector|body|documentElement|title)", logic)
if leftover:
    raise SystemExit(f"untransformed DOM access survived: {leftover.group(0)}")

# ---------------------------------------------------------------------
# 3. The embeddable widget (Shadow DOM, one <script> tag)
# ---------------------------------------------------------------------

widget = f"""/*!
 * WTS Online Program Cost Estimator — embeddable widget
 * Renders into <div id="wts-cost-estimator"></div> (created automatically
 * next to this script tag if the div is missing). All markup and styles
 * live in a Shadow DOM, so nothing collides with the host page's CSS.
 * Source: https://github.com/wts-developer/wts-web (projects/tuition-estimator)
 */
(function () {{
  "use strict";

  var CSS = {json.dumps(widget_css)};
  var HTML = {json.dumps(body_html)};
  var FONTS_URL = {json.dumps(FONTS_URL)};
  var currentScript = document.currentScript;

  // @font-face must live in the light DOM; shadow content can then use it.
  function ensureFonts() {{
    if (document.querySelector("link[data-wts-estimator-fonts]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_URL;
    link.setAttribute("data-wts-estimator-fonts", "");
    document.head.appendChild(link);
  }}

  function runCalculator(root, app) {{
{logic}
  }}

  function boot(host) {{
    if (host.shadowRoot) return; // already booted
    ensureFonts();
    var shadow = host.attachShadow({{ mode: "open" }});
    var style = document.createElement("style");
    style.textContent = CSS;
    shadow.appendChild(style);
    var app = document.createElement("div");
    app.className = "wts-estimator-app";
    app.innerHTML = HTML;
    shadow.appendChild(app);
    runCalculator(shadow, app);
  }}

  function init() {{
    var host = document.getElementById("wts-cost-estimator");
    if (!host) {{
      host = document.createElement("div");
      host.id = "wts-cost-estimator";
      if (currentScript && currentScript.parentNode) {{
        currentScript.parentNode.insertBefore(host, currentScript);
      }} else {{
        document.body.appendChild(host);
      }}
    }}
    boot(host);
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", init);
  }} else {{
    init();
  }}
}})();
"""

# ---------------------------------------------------------------------
# 4. Standalone calculator page (parity with the Apps Script original)
# ---------------------------------------------------------------------

standalone = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WTS Online Program Cost Estimator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{FONTS_URL}" rel="stylesheet">
  <style>
{css}
  </style>
</head>
<body>
{body_html}
<script>
{logic_src}
</script>
</body>
</html>
"""

# ---------------------------------------------------------------------
# 5. The clickable mockup: captured tuition page + widget after hero
# ---------------------------------------------------------------------

# First section that follows the hero on the live page.
ANCHOR = '<div class="content-section light-grey margin">'
if ANCHOR not in captured_page:
    raise SystemExit("injection anchor not found — was src/wts-tuition-page.html re-captured?")

# `</` would terminate the inline <script> block early; escape it (valid
# inside JS string literals, which is the only place it occurs).
inline_widget = widget.replace("</", "<\\/")

embed_block = f"""
<!-- ================================================================
     BEGIN PROPOSED ADDITION — Online Program Cost Estimator
     Everything between these markers is the new content this mockup
     demonstrates. In Webflow, this is one Embed element; see
     projects/tuition-estimator/webflow/WEBFLOW_INTEGRATION.md
     ================================================================ -->
<div id="wts-cost-estimator"></div>
<script>
{inline_widget}
</script>
<!-- ================ END PROPOSED ADDITION ================ -->
"""

mockup = captured_page.replace(ANCHOR, embed_block + ANCHOR, 1)
# Resolve the captured page's relative URLs against production.
mockup = mockup.replace("<head>", '<head><base href="https://www.wts.edu/">', 1)
# Capture artifact fix: the hero copy starts at opacity 0 and relies on a
# Webflow interaction to fade in, which doesn't always fire in this captured
# copy (notably on mobile), leaving the above-the-fold section blank. Force it
# visible; the production page is unaffected. Not part of the proposed change.
mockup = mockup.replace(
    "</head>",
    "<style>.tuition-hero-new [data-w-id][style*=\"opacity\"] { opacity: 1 !important; }</style></head>",
    1,
)
mockup = mockup.replace("<title>", "<title>[MOCKUP] ", 1)
mockup = mockup.replace(
    "<!DOCTYPE html>",
    """<!DOCTYPE html>
<!-- ================================================================
     LIVING MOCKUP — not a wts.edu production page.
     This is a captured copy of https://www.wts.edu/admissions/tuition-financial-aid
     with one proposed addition: the Online Program Cost Estimator,
     injected directly below the hero (search for "BEGIN PROPOSED ADDITION").
     Built from https://github.com/wts-developer/wts-web
     ================================================================ -->""",
    1,
)

# ---------------------------------------------------------------------

dist = ROOT / "dist"
dist.mkdir(exist_ok=True)
for name, content in [
    ("wts-cost-estimator.js", widget),
    ("index.html", mockup),
    ("calculator-standalone.html", standalone),
]:
    (dist / name).write_text(content)
    print(f"dist/{name}  {len(content) / 1024:.1f} KB")
