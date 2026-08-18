# wts-web

Monorepo for Westminster Theological Seminary (wts.edu) web projects: mockups,
embeddable widgets, and snippets intended to hand off to the wts.edu webmaster
for integration into the production Webflow site.

## Projects

| Project | Status | What it is |
|---|---|---|
| [projects/tuition-estimator](projects/tuition-estimator/) | ✅ v1, shipping | Living, clickable mockup of the [tuition page](https://www.wts.edu/admissions/tuition-financial-aid) with the Tuition Savings Calculator embedded below the hero, plus a one-tag embeddable widget for Webflow |
| [projects/tuition-chat-widget](projects/tuition-chat-widget/) | 🧪 v2, in UAT | Floating bottom-right chat dialog for the tuition page: one-tag Shadow-DOM embed, answered by the Hedwig web-chat API (`hedwig-admissions-slackbot` repo, `hedwig/webchat/`) |

> **Data policy (important):** Westminster is bound by FERPA and its
> AI Acceptable Use Policy. This repo holds public data only (published
> tuition figures, captures of public wts.edu pages); student records,
> applicant data, and PII must never enter it. AI coding agents must
> never call the Hedwig API or any Westminster system, not even to test
> response shapes: the agent stops, hands the human the exact command
> to run on a Westminster device, and the human reviews, redacts, and
> reports back only a succinct answer. Approved data paths are the
> deployed Hedwig app on Westminster-managed infrastructure and scripts
> hand-executed by humans on Westminster devices. Details in
> [AGENTS.md](AGENTS.md#data-policy-ferpa-and-the-westminster-ai-acceptable-use-policy).

AI coding agents and new contributors: start with [AGENTS.md](AGENTS.md)
for ground rules, dev servers, and verification steps.

## Conventions

- Each project lives under `projects/<name>/` and is self-contained: its own
  `README.md`, sources in `src/`, a zero-dependency build, and committed
  outputs in `dist/`.
- `dist/` is committed on purpose: it lets us share working links straight
  from GitHub Pages or jsDelivr without a release step, and lets the wts.edu
  webmaster grab a single file.
- Builds are Python 3 standard library only (`python3 build.py`), so they run
  anywhere with no Node toolchain required. If a future project needs one, add it
  per-project.

## Local development

```sh
python3 projects/tuition-estimator/build.py
python3 -m http.server 8437 -d projects/tuition-estimator/dist
# open http://localhost:8437
```

(Claude Code users: `.claude/launch.json` defines the same server.)

## Sharing links (GitHub Pages)

`.github/workflows/pages.yml` publishes every project's `dist/` on push to
`main`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

- Mockup: `https://wts-developer.github.io/wts-web/tuition-estimator/`
- Calculator-only mockup (no chat, matches the v1 rollout): `https://wts-developer.github.io/wts-web/tuition-estimator/calculator-only.html`
- Widget: `https://wts-developer.github.io/wts-web/tuition-estimator/wts-cost-estimator.js`
- Standalone estimator: `https://wts-developer.github.io/wts-web/tuition-estimator/calculator-standalone.html`
- Chat mockup: `https://wts-developer.github.io/wts-web/tuition-chat-widget/`
- Chat widget: `https://wts-developer.github.io/wts-web/tuition-chat-widget/wts-tuition-chat.js`

Alternatively, any file in a public repo is served by jsDelivr, e.g.
`https://cdn.jsdelivr.net/gh/wts-developer/wts-web@main/projects/tuition-estimator/dist/wts-cost-estimator.js`.

To share as a file instead of a link, send `projects/tuition-estimator/dist/index.html`;
it is fully self-contained apart from assets it loads from production CDNs.
