# wts-web

Monorepo for Westminster Theological Seminary (wts.edu) web projects — mockups,
embeddable widgets, and snippets intended to hand off to the wts.edu webmaster
for integration into the production Webflow site.

## Projects

| Project | Status | What it is |
|---|---|---|
| [projects/tuition-estimator](projects/tuition-estimator/) | ✅ ready | Living, clickable mockup of the [tuition page](https://www.wts.edu/admissions/tuition-financial-aid) with the Online Program Cost Estimator embedded front-and-center, plus a one-tag embeddable widget for Webflow |
| [projects/tuition-chat-widget](projects/tuition-chat-widget/) | 🚧 planned | Show/hideable chat dialog snippet for the tuition page, backed by the Hedwig admissions bot |

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

## Sharing

**As a file (works today):** send `projects/tuition-estimator/dist/index.html` —
it is fully self-contained apart from assets it loads from production CDNs.

**As a link:** this repo is currently **private**, which rules out GitHub
Pages (free plan) and jsDelivr. Options:

- Connect the repo to **Cloudflare Pages or Netlify** (free tiers deploy from
  private repos): build command `python3 projects/tuition-estimator/build.py`,
  publish directory `projects/tuition-estimator/dist`. This also yields the
  stable public URL for `wts-cost-estimator.js` that the production Webflow
  embed needs.
- Or make the repo public, enable **Settings → Pages → Source: GitHub
  Actions**, and `.github/workflows/pages.yml` publishes on every push to
  `main` at `https://wts-developer.github.io/wts-web/tuition-estimator/`
  (jsDelivr also works for public repos).

Once hosting exists, replace `WIDGET_URL` in
`projects/tuition-estimator/webflow/embed-snippet.html` with the real URL.
