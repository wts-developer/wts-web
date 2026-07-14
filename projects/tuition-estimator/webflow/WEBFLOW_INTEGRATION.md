# Adding the Online Program Cost Estimator to wts.edu (Webflow)

This is the integration guide that accompanies the clickable mockup
(`dist/index.html` — attached to the ticket, or hosted per the repo README).
The mockup is the current production tuition page with **one addition**: the
cost estimator, placed between the hero and the "Westminster Scholarships and
Tuition" section. Everything else on the page is untouched.

## Option A (recommended): one Embed element

1. In the Webflow Designer, open the **Tuition & Financial Aid** page.
2. Drag an **Embed** element to the spot right after the hero section
   (`content-section bkgd-hero-img hero-tall`) and before the
   scholarships/tuition tabs section (`content-section light-grey margin`).
3. Paste the contents of [`embed-snippet.html`](embed-snippet.html):

   ```html
   <div id="wts-cost-estimator"></div>
   <script src="WIDGET_URL/wts-cost-estimator.js" defer></script>
   ```

4. Publish. That's the whole integration.

### Hosting the widget file

`wts-cost-estimator.js` (~105 KB, one self-contained file, in this repo at
`projects/tuition-estimator/dist/` and attached to the ticket) needs to be
served from a URL — it exceeds Webflow's inline custom-code character limit,
and Webflow's asset manager doesn't accept `.js` uploads. Either works:

- **You host it** on any static hosting the wts.edu team already controls,
  and point the snippet's `src` at it. Nothing about the file is
  host-specific, and it never needs server-side logic.
- **We host it** (e.g. Cloudflare Pages / Netlify tied to this repo) and give
  you a stable URL to drop in.

### What the widget does

- Renders the estimator inside a **Shadow DOM**, so its styles cannot leak
  into the site and the site's styles cannot break it. No classes or IDs are
  added to the global page other than the `wts-cost-estimator` container div.
- Shows four blocks: Choose Your Program, Financial Information, Your
  Estimated Cost After Support, and Cost & Scholarship Mix.
- Adds one Google Fonts stylesheet (Lato + Roboto Mono) to the page head if
  not already present. The serif headline face uses the site's existing
  Typekit Kepler families.
- Makes **no network calls** other than that fonts stylesheet — all tuition
  math is client-side. No analytics, no cookies, no personal data.
- Is plain vanilla JS with no dependencies (no jQuery, no framework), and
  does not interfere with Webflow's own scripts.

### Configuration

Tuition rates, the rate-increase date, program credit counts, and matching
rules live in a single `CONFIG` object at the top of the widget source
(`projects/tuition-estimator/src/calculator.js` in the repo). Ask us for a
rebuilt file when rates change, or edit and rerun `python3 build.py`.

## Option B: rebuild natively in Webflow

If you prefer owning it in the Designer, the pieces are separated in the repo:

- `src/calculator.body.html` — semantic markup (sections, fields, results)
- `src/calculator.css` — styles; brand tokens (WTS red/gold/gray, radii,
  shadows) are CSS custom properties declared at the top
- `src/calculator.js` — logic; keep element IDs intact, as the script binds
  by ID

Caveats: the JS is ~36 KB, above Webflow's per-embed character limit, so
it would still need to load from a hosted file or be split; and the program
theme switching toggles `program-<key>` classes on the app wrapper, which
would need re-targeting if the markup is rebuilt with different structure.
We're happy to pair on this if Option B is the preference.

## Placement note

The section that follows the estimator on the tuition page overlaps upward
with an angled top edge. The widget already reserves ~150px of bottom padding
so the angle doesn't clip the last card — no extra spacer is needed.
