# tuition-estimator

A living, clickable mockup for the wts.edu webmaster: the production
[Tuition & Financial Aid page](https://www.wts.edu/admissions/tuition-financial-aid)
with the **Online Program Cost Estimator** embedded directly below the hero.
The goal is a ticket-ready demonstration of the change we're asking for, plus a
drop-in widget that makes the Webflow integration as close to copy-paste as
possible.

The embedded estimator shows exactly four blocks: **Choose Your Program**,
**Financial Information** (outside support + start term), **Your Estimated
Cost After Support**, and **Cost & Scholarship Mix**. The longer-form sections
of the original prototype (estimate summary, per-term table, market
comparison) exist only on the standalone page.

## Outputs (`dist/`, committed)

| File | Purpose |
|---|---|
| `index.html` | The mockup: a captured copy of the live tuition page with the widget injected after the hero. Attach the file to a ticket or share as a hosted link (see the root README's Sharing section) — it loads Webflow assets from production CDNs, so it needs internet but no server. |
| `wts-cost-estimator.js` | The embeddable widget, one file, no dependencies. `<div id="wts-cost-estimator"></div>` + one `<script>` tag renders the estimator in a Shadow DOM (zero CSS collisions with the host page). |
| `calculator-standalone.html` | The full estimator on its own page — parity with the Apps Script prototype, including the summary/per-term/market sections. |

## Build

```sh
python3 build.py            # stdlib only, writes dist/
python3 -m http.server 8437 -d dist   # then open http://localhost:8437
```

## How it works

- `src/calculator.{css,body.html,js}` are the estimator's stylesheet, markup,
  and logic, extracted **verbatim** from the Apps Script prototype. Keep them
  pristine — all embed-specific rewrites happen in `build.py` at build time:
  - CSS: `:root` → `:host`, `body` selectors → `.wts-estimator-app`, embed-only
    rules appended (hide the prototype's hero and long-form sections).
  - JS: `document.getElementById/querySelectorAll` → shadow-root equivalents,
    `document.body` theming → the widget wrapper element.
- `src/wts-tuition-page.html` is the live tuition page captured as-is. The
  build injects the widget between the hero and the first content section and
  adds `<base href="https://www.wts.edu/">` so relative URLs resolve against
  production. The injected block is fenced with
  `BEGIN/END PROPOSED ADDITION` comments.

## Updating the estimator from the Apps Script prototype

The prototype lives in Google Apps Script (deployment `AKfycbwQKu…`). After
publishing a change there, re-extract:

```sh
curl -sL "https://script.google.com/macros/s/AKfycbwQKuhhVUufIxEDeWdmWSOIjbEncauZOeKen2EczoTDsr74gaJVuOceeAGGaWQCpNIbJg/exec" -o /tmp/calc-shell.html
python3 - <<'EOF'
import re, json, codecs
raw = open('/tmp/calc-shell.html').read()
m = re.search(r'goog\.script\.init\("(.+?)"\)', raw, re.S)
decoded = codecs.decode(m.group(1).replace(r'\/', '/'), 'unicode_escape')
obj, _ = json.JSONDecoder().raw_decode(decoded)
html = obj['userHtml']
style = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
script = re.search(r'<script>(.*?)</script>', html, re.S).group(1)
body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1).replace('<script>'+script+'</script>', '')
open('src/calculator.css','w').write(style)
open('src/calculator.js','w').write(script)
open('src/calculator.body.html','w').write(body)
EOF
python3 build.py
```

To re-capture the tuition page itself (if wts.edu redesigns it):
`curl -sL https://www.wts.edu/admissions/tuition-financial-aid -o src/wts-tuition-page.html`,
then check that the injection anchor in `build.py` still matches.

## For the webmaster

See [webflow/WEBFLOW_INTEGRATION.md](webflow/WEBFLOW_INTEGRATION.md) and
[webflow/embed-snippet.html](webflow/embed-snippet.html).
