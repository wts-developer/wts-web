#!/usr/bin/env python3
"""Build for the WTS tuition chat widget.

Inputs (src/):
  chat.css / chat.body.html / chat.js
      — the widget's styles, markup, and logic. chat.js is written
        shadow-DOM-aware (everything scopes off the shadow root), so no
        rewrite pass is needed; the build just inlines the three files.
  mock-answers.json
      — canned hedwig.webchat.answer_prompt output (student mode) so the
        demo page works with no backend. Regenerate per README when the
        tuition data changes.
  ../tuition-estimator/src/wts-tuition-page.html
      — the live wts.edu tuition page capture, shared with the estimator
        project (one capture, two mockups).

Outputs (dist/):
  wts-tuition-chat.js — single-file embeddable widget (Shadow DOM)
  index.html          — clickable mockup: captured tuition page with the
                        chat launcher bottom-right. Canned answers by
                        default; add ?api=http://localhost:8787 (or the
                        Render URL) to talk to the real backend.

Standard library only. Run with: python3 build.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
read = lambda p: (ROOT / p).read_text()

css = read("src/chat.css")
body_html = read("src/chat.body.html")
logic = read("src/chat.js")
mock = json.loads(read("src/mock-answers.json"))
captured_page = (ROOT / "../tuition-estimator/src/wts-tuition-page.html").read_text()

# The Render web service defined in hedwig-admissions-slackbot/render.yaml
# (hedwig/webchat/). Override per-embed with data-api-base or
# window.WTS_TUITION_CHAT_CONFIG.
DEFAULT_API_BASE = "https://hedwig-webchat-api.onrender.com"

# Same faces as the estimator widget (Kepler comes from wts.edu's Typekit).
FONTS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Lato:wght@400;700;900&family=Roboto+Mono:wght@400;500&display=swap"
)

if re.search(r"document\.(getElementById|querySelector|body\b|title)", logic):
    raise SystemExit("chat.js must stay shadow-scoped (no document-level lookups)")


def indent(text, spaces):
    pad = " " * spaces
    return "\n".join(pad + line if line.strip() else line for line in text.splitlines())


# ---------------------------------------------------------------------
# 1. The embeddable widget (Shadow DOM, one <script> tag)
# ---------------------------------------------------------------------

widget = f"""/*!
 * WTS Tuition Chat — embeddable widget
 * Floating bottom-right chat dialog for prospective-student tuition
 * questions, answered by the Hedwig web-chat API (repo:
 * hedwig-admissions-slackbot, hedwig/webchat/). All markup and styles
 * live in a Shadow DOM, so nothing collides with the host page's CSS.
 *
 * Configuration (optional):
 *   <script src=".../wts-tuition-chat.js" data-api-base="https://..."></script>
 *   or window.WTS_TUITION_CHAT_CONFIG = {{ apiBase: "https://...", mock: fn }}
 *
 * Source: https://github.com/wts-developer/wts-web (projects/tuition-chat-widget)
 */
(function () {{
  "use strict";

  var CSS = {json.dumps(css)};
  var HTML = {json.dumps(body_html)};
  var FONTS_URL = {json.dumps(FONTS_URL)};
  var DEFAULT_API_BASE = {json.dumps(DEFAULT_API_BASE)};
  var currentScript = document.currentScript;

  // @font-face must live in the light DOM; shadow content can then use it.
  function ensureFonts() {{
    if (document.querySelector("link[data-wts-chat-fonts]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_URL;
    link.setAttribute("data-wts-chat-fonts", "");
    document.head.appendChild(link);
  }}

{indent(logic, 2)}

  function resolveConfig() {{
    var config = {{ apiBase: DEFAULT_API_BASE }};
    var overrides = window.WTS_TUITION_CHAT_CONFIG || {{}};
    for (var k in overrides) config[k] = overrides[k];
    if (currentScript && currentScript.dataset && currentScript.dataset.apiBase) {{
      config.apiBase = currentScript.dataset.apiBase;
    }}
    return config;
  }}

  function boot(host) {{
    if (host.shadowRoot) return; // already booted
    ensureFonts();
    var shadow = host.attachShadow({{ mode: "open" }});
    var style = document.createElement("style");
    style.textContent = CSS;
    shadow.appendChild(style);
    var wrapper = document.createElement("div");
    wrapper.innerHTML = HTML;
    var app = wrapper.firstElementChild;
    shadow.appendChild(app);
    runChat(shadow, app, resolveConfig());
  }}

  function init() {{
    var host = document.getElementById("wts-tuition-chat");
    if (!host) {{
      // The widget is fixed-position, so the host can live anywhere;
      // body-append keeps it out of the page's layout entirely.
      host = document.createElement("div");
      host.id = "wts-tuition-chat";
      document.body.appendChild(host);
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
# 2. The clickable mockup: captured tuition page + chat launcher
# ---------------------------------------------------------------------

# Canned-answer transport for the demo: keyword-matches a few real
# engine outputs (src/mock-answers.json) so the dialog demos with no
# backend. `?api=<url>` switches to the live API.
demo_config = f"""
<script>
(function () {{
  var MOCK = {json.dumps(mock)};
  var api = new URLSearchParams(location.search).get("api");
  if (api) {{
    window.WTS_TUITION_CHAT_CONFIG = {{ apiBase: api }};
    return;
  }}
  window.WTS_TUITION_CHAT_CONFIG = {{
    mock: function (text) {{
      var t = text.toLowerCase();
      if (/^(hi|hello|hey)\\b/.test(t)) return {{ reply: MOCK.welcome, routed: false }};
      for (var i = 0; i < MOCK.answers.length; i++) {{
        var a = MOCK.answers[i];
        for (var j = 0; j < a.match.length; j++) {{
          if (t.indexOf(a.match[j]) !== -1) return {{ reply: a.reply, routed: true }};
        }}
      }}
      return {{ reply: MOCK.fallback, routed: false }};
    }},
  }};
}})();
</script>
"""

# `</` would terminate the inline <script> block early; escape it (valid
# inside JS string literals, which is the only place it occurs).
inline_widget = widget.replace("</", "<\\/")

embed_block = f"""
<!-- ================================================================
     BEGIN PROPOSED ADDITION — Tuition Chat Widget
     Everything between these markers is the new content this mockup
     demonstrates. In Webflow this is one Embed element (or site-wide
     custom code); see projects/tuition-chat-widget/webflow/
     WEBFLOW_INTEGRATION.md. The mockup answers from canned data unless
     ?api=<backend url> is in the query string.
     ================================================================ -->
{demo_config}
<script>
{inline_widget}
</script>
<!-- ================ END PROPOSED ADDITION ================ -->
"""

if "</body>" not in captured_page:
    raise SystemExit("captured page has no </body> — was it re-captured correctly?")
mockup = captured_page.replace("</body>", embed_block + "</body>", 1)
# Resolve the captured page's relative URLs against production.
mockup = mockup.replace("<head>", '<head><base href="https://www.wts.edu/">', 1)
mockup = mockup.replace("<title>", "<title>[MOCKUP] ", 1)
mockup = mockup.replace(
    "<!DOCTYPE html>",
    """<!DOCTYPE html>
<!-- ================================================================
     LIVING MOCKUP — not a wts.edu production page.
     This is a captured copy of https://www.wts.edu/admissions/tuition-financial-aid
     with one proposed addition: the Tuition Chat Widget, a floating
     bottom-right chat dialog (search for "BEGIN PROPOSED ADDITION").
     Built from https://github.com/wts-developer/wts-web
     ================================================================ -->""",
    1,
)

# ---------------------------------------------------------------------

dist = ROOT / "dist"
dist.mkdir(exist_ok=True)
for name, content in [
    ("wts-tuition-chat.js", widget),
    ("index.html", mockup),
]:
    (dist / name).write_text(content)
    print(f"dist/{name}  {len(content) / 1024:.1f} KB")
