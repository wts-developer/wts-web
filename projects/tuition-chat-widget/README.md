# tuition-chat-widget

A show/hideable chat dialog for prospective students who would rather get
tuition questions answered conversationally, embeddable on the
[Tuition & Financial Aid page](https://www.wts.edu/admissions/tuition-financial-aid).
Collapsed to a floating bottom-right launcher; expands to a chat panel with
a Westminster-branded (identity-less, for now) assistant.

The answers come from the **Hedwig** backend (`../hedwig-admissions-slackbot`,
developed alongside this repo): a public, unauthenticated HTTP API
(`hedwig/webchat/`) that runs the same deterministic answer engine the
admissions team uses in Slack — NLU intent detection → tuition calculator →
student-framed rendering. **No AI model answers prospects**; every reply is
computed from the published tuition data in `hedwig/tuition/programs.py`,
and the exact answers were QA'd by counselors through Hedwig's Slack UAT
harness (which now literally calls the same `answer_prompt()` function this
widget hits).

## Outputs (`dist/`, committed)

| File | Purpose |
|---|---|
| `index.html` | The mockup: a captured copy of the live tuition page with the chat launcher floating bottom-right. Answers from canned engine output by default; add `?api=http://localhost:8787` (or the Render URL) to talk to a real backend. |
| `wts-tuition-chat.js` | The embeddable widget, one file, no dependencies. One `<script>` tag renders the launcher + dialog in a Shadow DOM (zero CSS collisions with the host page). |

## Build & run

```sh
python3 build.py                      # stdlib only, writes dist/
python3 -m http.server 8438 -d dist   # then open http://localhost:8438
```

To demo against the real engine locally, in `../../../hedwig-admissions-slackbot`:

```sh
source .venv/bin/activate
python -m hedwig.webchat              # serves on :8787, no Slack/SF creds needed
```

then open `http://localhost:8438/?api=http://localhost:8787`.
(`localhost:8438` is in the API's default CORS allowlist.)

## How it works

- `src/chat.{css,body.html,js}` are the widget's styles, markup, and logic.
  `chat.js` is written shadow-DOM-aware (no `document.*` lookups — `build.py`
  fails the build if one sneaks in), so the build simply inlines all three
  into one IIFE.
- The widget POSTs `{"message": "..."}` to `{apiBase}/api/chat` and gets back
  `{"reply": <Slack mrkdwn>, "routed": bool}`. The reply is Slack mrkdwn
  because the same engine serves Slack; a mini-renderer in `chat.js` handles
  the three constructs tuition answers use (``` code blocks → `<pre>`,
  `*bold*`, `_italic_`), HTML-escaped first.
- Open/closed state + transcript persist in `sessionStorage` for the visit.
- `src/mock-answers.json` is canned `answer_prompt()` output powering the
  no-backend demo. Regenerate after tuition data changes:

  ```sh
  cd ../../../hedwig-admissions-slackbot && source .venv/bin/activate && python - <<'EOF'
  # see git history of src/mock-answers.json, or just re-run:
  import json
  from hedwig.webchat import answer_prompt
  from hedwig.webchat.engine import WELCOME_REPLY, FALLBACK_REPLY
  path = "../wts-web/projects/tuition-chat-widget/src/mock-answers.json"
  mock = json.load(open(path))
  mock["welcome"], mock["fallback"] = WELCOME_REPLY, FALLBACK_REPLY
  for a in mock["answers"]:
      a["reply"] = answer_prompt(a["prompt"])["reply"]
  json.dump(mock, open(path, "w"), indent=2)
  EOF
  python3 build.py
  ```

## Backend contract

`POST {apiBase}/api/chat` with `{"message": str}` (≤500 chars) returns:

| Field | Meaning |
|---|---|
| `reply` | Slack-mrkdwn answer text, always student-framed |
| `routed` | `true` if the real tuition engine answered; `false` for greeting/fallback copy |

Errors (400/413/429) may include a user-displayable `reply`, which the
widget shows; otherwise it falls back to a generic apology. CORS is
allowlisted server-side (`WEBCHAT_ALLOWED_ORIGINS`); rate limiting is
20 requests/minute/IP.

## For the webmaster

See [webflow/WEBFLOW_INTEGRATION.md](webflow/WEBFLOW_INTEGRATION.md) and
[webflow/embed-snippet.html](webflow/embed-snippet.html).
