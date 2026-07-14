# wts-web

Monorepo for Westminster Theological Seminary (wts.edu) web projects — mockups,
embeddable widgets, and snippets intended to hand off to the wts.edu webmaster
for integration into the production Webflow site.

## Projects

| Project | Status | What it is |
|---|---|---|
| [projects/tuition-estimator](projects/tuition-estimator/) | ✅ ready | Living, clickable mockup of the [tuition page](https://www.wts.edu/admissions/tuition-financial-aid) with the Online Program Cost Estimator embedded front-and-center, plus a one-tag embeddable widget for Webflow |
| [projects/tuition-chat-widget](projects/tuition-chat-widget/) | ✅ ready | Floating bottom-right chat dialog for the tuition page — one-tag Shadow-DOM embed, answered by the Hedwig web-chat API (`hedwig-admissions-slackbot` repo, `hedwig/webchat/`) |

## Conventions

- Each project lives under `projects/<name>/` and is self-contained: its own
  `README.md`, sources in `src/`, a zero-dependency build, and committed
  outputs in `dist/`.
- `dist/` is committed on purpose: it lets us share working links straight
  from GitHub Pages or jsDelivr without a release step, and lets the wts.edu
  webmaster grab a single file.
- Builds are Python 3 standard library only (`python3 build.py`), so they run
  anywhere — no Node toolchain required. If a future project needs one, add it
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
- Widget: `https://wts-developer.github.io/wts-web/tuition-estimator/wts-cost-estimator.js`
- Standalone estimator: `https://wts-developer.github.io/wts-web/tuition-estimator/calculator-standalone.html`
- Chat mockup: `https://wts-developer.github.io/wts-web/tuition-chat-widget/`
- Chat widget: `https://wts-developer.github.io/wts-web/tuition-chat-widget/wts-tuition-chat.js`

Alternatively, any file in a public repo is served by jsDelivr, e.g.
`https://cdn.jsdelivr.net/gh/wts-developer/wts-web@main/projects/tuition-estimator/dist/wts-cost-estimator.js`.

To share as a file instead of a link, send `projects/tuition-estimator/dist/index.html` —
it is fully self-contained apart from assets it loads from production CDNs.
