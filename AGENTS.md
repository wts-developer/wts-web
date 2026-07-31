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

## Branches, PRs, and review

Multiple people and agents work in this repo. All changes land on
`main` through pull requests; do not push to `main` directly.

1. **Branch per change**, named `<area>/<short-slug>`, for example
   `estimator/max-match-copy`, `chat/cold-start-note`,
   `docs/uat-checklist`. Keep each branch to one reviewable change.
2. **Commit source and rebuilt `dist/` together** on the branch. A PR
   whose `dist/` does not match its `src/` is not mergeable; reviewers
   should rebuild and diff if in doubt.
3. **Open a PR against `main`** with: what changed and why, how it was
   verified (which pages, which viewports, which dollar figures), and a
   screenshot when the change is visual.
4. **Review before merge.** At least one human approval. Changes to
   policy data (rates, scholarship rules, caps, term calendars, fees)
   additionally need the admissions or financial aid direction that
   authorized them linked or quoted in the PR, and a note confirming
   the Hedwig engine and canned chat answers were reconciled.
5. **Merging is deploying.** GitHub Pages publishes `main`
   automatically, and the shared UAT link updates within about a
   minute. Do not merge unverified or half-done work; it goes straight
   in front of stakeholders.
6. **Agents: stop at the PR.** Push the branch, open the PR, report the
   link. Never merge your own PR and never force-push shared branches.

Published URLs (from `main`):

- Combined UAT mockup: <https://wts-developer.github.io/wts-web/tuition-estimator/>
- Estimator widget: <https://wts-developer.github.io/wts-web/tuition-estimator/wts-cost-estimator.js>
- Chat widget: <https://wts-developer.github.io/wts-web/tuition-chat-widget/wts-tuition-chat.js>

Webmaster-facing integration docs live in each project's `webflow/`
directory; keep them accurate when behavior changes.
