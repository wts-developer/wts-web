# Webflow integration — Tuition Chat Widget

The widget is one `<script>` tag. It creates its own floating launcher
button (bottom-right) and chat panel, all inside a Shadow DOM, so it
takes up **no layout space** and **no wts.edu styles can collide with it**
(and vice versa).

## Where to paste it

Two options, depending on rollout scope:

1. **One page only (recommended to start).** On the
   [Tuition & Financial Aid page](https://www.wts.edu/admissions/tuition-financial-aid),
   add an **Embed** element anywhere in the page body and paste the
   contents of [embed-snippet.html](embed-snippet.html). Position in the
   page doesn't matter — the widget floats.
2. **Site-wide.** Project **Settings → Custom Code → Footer Code**, same
   snippet. The launcher then appears on every page.

## What it does

- Collapsed by default: a circular launcher button, bottom-right.
- Click to open a chat panel; a welcome message offers three example
  questions as one-tap chips.
- Answers come from the Hedwig web-chat API (`hedwig-admissions-slackbot`
  repo, `hedwig/webchat/`), which serves the same student-framed tuition
  answers the admissions team QA'd in Slack UAT. No AI model is involved —
  it's a deterministic NLU + calculator pipeline over published tuition
  data, so answers can't hallucinate numbers.
- Open/closed state and the conversation survive page navigation within
  the visit (sessionStorage); nothing persists after the tab closes, and
  no cookies are set.
- If the API is unreachable, the widget shows a friendly error with the
  admissions email instead of failing silently.

## Configuration

None required. The script defaults to the production API
(`https://hedwig-webchat-api.onrender.com`). To point elsewhere (staging,
local dev), add `data-api-base="https://..."` to the script tag.

## Backend prerequisites (for the developer, not the webmaster)

- The `hedwig-webchat-api` Render service must be deployed
  (`render.yaml` in the hedwig-admissions-slackbot repo).
- `https://www.wts.edu` is in the API's CORS allowlist by default; if the
  site ever moves domains, set `WEBCHAT_ALLOWED_ORIGINS` on the Render
  service.

## Verifying after publish

1. Load the tuition page; a red circular chat button should sit
   bottom-right, over the page content.
2. Click it, tap the first suggestion chip, and confirm a formatted
   estimate (with a monospace cost breakdown) comes back within a couple
   of seconds.
3. Ask something off-topic ("what's the dining hall like?") and confirm
   the polite fallback listing the programs it can price.
