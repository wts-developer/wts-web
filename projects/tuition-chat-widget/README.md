# tuition-chat-widget

A show/hideable chat dialog for prospective students who would rather get
tuition questions answered conversationally, embeddable on the
[Tuition & Financial Aid page](https://www.wts.edu/admissions/tuition-financial-aid).
Collapsed to a floating bottom-right launcher; expands to a chat panel with
a Westminster-branded (identity-less, for now) assistant.

The answers come from the **Hedwig** backend (`../hedwig-admissions-slackbot`,
developed alongside this repo): a public, unauthenticated HTTP API
(`hedwig/webchat/`). Two things can answer behind it:

- **Hedwig's tuition engine**, the same deterministic pipeline the
  admissions team uses in Slack: NLU intent detection, then the tuition
  calculator, then student-framed rendering. No AI model; every figure is
  computed from the published tuition data in `hedwig/tuition/programs.py`,
  and the answers were QA'd by counselors through Hedwig's Slack UAT
  harness. **This is what answers on wts.edu today.**
- **Westminster's AI assistant** (the *WTS Prospective Student Helper*
  Agentforce agent), which answers tuition, scholarship and application
  questions in conversation from a reviewed reference library
  (`libraries/admissions-reference/` in edcloud-salesforce). Hedwig sends a
  message to it first when it is configured and the request may reach it,
  and falls back to the engine when it cannot. Until launch, only internal
  test pages that send the test key (`agentKey`, below) reach it.

When the assistant answers, the widget switches to **AI mode**: the welcome,
the input placeholder and the footer say that an AI assistant is answering
and can make mistakes. AI mode also turns on from the embed's config
(`agentKey` or `ai`), so the notice is there before anyone types.

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
  `chat.js` is written shadow-DOM-aware (no `document.*` lookups; `build.py`
  fails the build if one sneaks in), so the build simply inlines all three
  into one IIFE.
- The widget POSTs `{"message": "..."}` to `{apiBase}/api/chat` and gets back
  `{"reply": <Slack mrkdwn>, "routed": bool}`. The reply is Slack mrkdwn
  because the same engine serves Slack; a mini-renderer in `chat.js` handles
  the three constructs tuition answers use (``` code blocks → `<pre>`,
  `*bold*`, `_italic_`), HTML-escaped first.
- Open/closed state + transcript persist in `sessionStorage` for the visit,
  under `wtsTuitionChat.v1`. A page that signs people out (the applicant
  portal) calls `window.WTSTuitionChat.reset()`, which forgets the
  conversation and closes the chat, so the next person on a shared computer
  doesn't see it; if the script may not have run yet, it removes that key
  too.
- `fonts: false` in the config skips the Google Fonts stylesheet, for pages
  that serve Lato themselves or whose CSP blocks `fonts.googleapis.com`.
- `src/mock-answers.json` is canned `answer_prompt()` output powering the
  no-backend demo. All content is public tuition data. Regenerate after
  tuition data changes (a human runs this on a Westminster device; per
  the repo data policy in AGENTS.md, agents must not run commands that
  pull data through themselves from live systems, and must instead hand
  the human the command and receive back only a succinct confirmation):

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
      r = answer_prompt(a["prompt"])
      a["reply"] = r["reply"]
      a["outro"] = r.get("outro")
  json.dump(mock, open(path, "w"), indent=2)
  EOF
  python3 build.py
  ```

## Backend contract

`POST {apiBase}/api/chat` with `{"message": str, "conversation": str|null}`
(message ≤500 chars) returns:

| Field | Meaning |
|---|---|
| `reply` | Slack-mrkdwn answer text, always student-framed |
| `routed` | `true` if the engine or the assistant answered; `false` for greeting/fallback copy |
| `outro` | Closing boilerplate (no hidden fees, counselor pointer) as a separate string, or `null`; the widget renders it once per browser session |
| `source` | `"agent"` (the AI assistant) or `"engine"`; absent when Hedwig has no assistant configured |
| `conversation` | Token to send with the next message so the assistant keeps its context; `null` or absent ends the conversation |

With `agentKey` set, the widget sends it in an `X-Webchat-Key` header.
Hedwig lets only requests carrying its `WEBCHAT_AGENT_KEY` reach the
assistant until launch; everything else gets the engine.

Errors (400/413/429) may include a user-displayable `reply`, which the
widget shows; otherwise it falls back to a generic apology. CORS is
allowlisted server-side (`WEBCHAT_ALLOWED_ORIGINS`); rate limiting is
20 requests/minute/IP.

## Configuration

| Option | Script attribute | `window.WTS_TUITION_CHAT_CONFIG` | Effect |
|---|---|---|---|
| API base | `data-api-base` | `apiBase` | Backend to call; defaults to the production Render service |
| Test key | `data-agent-key` | `agentKey` | Sent as `X-Webchat-Key`; turns AI mode on. **Internal test pages only**, never the public wts.edu embed: anything in a public page is readable by everyone |
| AI mode | `data-ai` | `ai: true` | Says from the start that an AI assistant answers. For wts.edu once the assistant launches |
| Theme | `data-theme` | `theme` | `light` (default), `dark`, or `auto`. `auto` follows the page when it marks its theme (`data-theme="dark"` or a `dark` class on `<html>`), else the visitor's system setting, and switches live when either changes. wts.edu stays `light`: it has no dark mode, and a dark chat on a light page looks broken |

An internal test page (behind its own sign-in) embeds it like this, with
the key the Hedwig maintainer gives you:

```html
<script src="https://wts-developer.github.io/wts-web/tuition-chat-widget/wts-tuition-chat.js"
        data-agent-key="..." defer></script>
```

The page's origin must be in Hedwig's CORS allowlist.

`?theme=dark` (or `auto`) on the mockup previews the themes.

The header's expand button switches the panel between its usual size and a larger
one (up to 760 by 820 pixels, never past the window), remembered for the visit.
Phones already get a full-width panel and don't show it.
`?mock=agent` on the mockup labels every canned answer as the
assistant's (with one canned deadline answer), to check AI mode with no
network call.

## For the webmaster

See [webflow/WEBFLOW_INTEGRATION.md](webflow/WEBFLOW_INTEGRATION.md) and
[webflow/embed-snippet.html](webflow/embed-snippet.html).
