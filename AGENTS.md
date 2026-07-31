# Agent instructions for wts-web

Guidance for AI coding agents (Codex, Copilot, Cursor, Claude, and
friends) and for humans arriving fresh. Read this before editing.

## What this repo is

Mockups and embeddable widgets proposed for wts.edu, which is built and
maintained in Webflow by a separate webmaster. Nothing here deploys to
wts.edu directly; the deliverables are living demo pages (published via
GitHub Pages) and single-file widgets the webmaster pastes into Webflow
Embed elements.

| Path | What it is |
|---|---|
| `projects/tuition-estimator/` | Tuition Savings Calculator widget plus the combined UAT mockup page (calculator and chat together on a captured copy of the live tuition page) |
| `projects/tuition-chat-widget/` | Floating chat dialog widget answered by the Hedwig web-chat API (separate repo: `hedwig-admissions-slackbot`) |
| `site/` | Landing page for the GitHub Pages site |
| `.github/workflows/pages.yml` | Publishes every project's `dist/` to GitHub Pages on push to `main` |

## Ground rules

1. **Python 3 standard library only.** Builds, dev servers, and tooling
   use nothing outside the stdlib. There is no Node toolchain on the
   maintainer's machine; do not add npm, package.json, or pip
   dependencies.
2. **Never edit `dist/` by hand.** Edit `src/`, run the project's
   `build.py`, and commit source and dist together. `dist/` is committed
   deliberately so GitHub Pages and jsDelivr can serve it without a
   release step.
3. **Build order matters once**: the estimator mockup inlines
   `projects/tuition-chat-widget/dist/embed-block.html`, so after chat
   changes build the chat widget first, then the estimator.
4. **No em-dashes** in any copy, comments, or commit messages. Use
   colons, semicolons, commas, or parentheses.
5. **Tuition numbers are policy, not styling.** Rates, scholarship
   rules, term calendars, and fees live in `CONFIG` and `SCHOLARSHIPS`
   inside `projects/tuition-estimator/src/calculator.js`, and must stay
   consistent with the Hedwig engine
   (`hedwig-admissions-slackbot/hedwig/tuition/programs.py` and
   `calculator.py`). Do not invent or change dollar amounts, caps,
   percentages, or effective dates without explicit direction; when one
   side changes, reconcile the other and regenerate the chat widget's
   canned answers (recipe in `projects/tuition-chat-widget/README.md`).
6. **Widgets stay self-contained.** One JS file each, rendered into a
   Shadow DOM, no frameworks, no external requests beyond one Google
   Fonts stylesheet (estimator) and the chat API. Keep it that way; it
   is the core of the Webflow integration story.

## Spin up a dev server

Tuition estimator, with auto-rebuild and browser live-reload (best for
iterating):

```sh
python3 projects/tuition-estimator/dev.py
# open http://localhost:8437 (combined mockup)
# also /calculator-standalone.html (estimator alone, no Webflow page)
```

It watches `src/` and `build.py`, rebuilds on change, and reloads open
tabs about a second later. A failed build keeps serving the last good
output and prints the error.

Plain static servers, if you prefer manual rebuilds:

```sh
python3 projects/tuition-estimator/build.py
python3 -m http.server 8437 -d projects/tuition-estimator/dist

python3 projects/tuition-chat-widget/build.py
python3 -m http.server 8438 -d projects/tuition-chat-widget/dist
```

Chat on the mockups answers from the live Hedwig API by default.
`?mock=1` forces canned offline answers; `?api=http://localhost:8787`
targets a locally running engine (`python -m hedwig.webchat` in the
Hedwig repo).

## Verify changes

- Open the mockup and the standalone page; exercise what you touched on
  desktop and a narrow (mobile) viewport.
- Spot-check money: MATS with a September 2026 start and $0 support
  should read $26,425 (blended tuition $26,325 plus the $100
  application fee). MDiv and MAR use a three-semester
  Summer/Fall/Spring calendar; MAC and MATS use four terms (January,
  March, June, September).
- If you changed anything the chatbot also answers, confirm the
  calculator and a chat reply agree to the dollar for the same
  scenario.

## Ship

Commit source plus rebuilt `dist/`, push to `main`. GitHub Pages
publishes automatically:

- Combined UAT mockup: <https://wts-developer.github.io/wts-web/tuition-estimator/>
- Estimator widget: <https://wts-developer.github.io/wts-web/tuition-estimator/wts-cost-estimator.js>
- Chat widget: <https://wts-developer.github.io/wts-web/tuition-chat-widget/wts-tuition-chat.js>

Webmaster-facing integration docs live in each project's `webflow/`
directory; keep them accurate when behavior changes.
