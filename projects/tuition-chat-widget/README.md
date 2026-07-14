# tuition-chat-widget (planned)

A small show/hideable chat dialog for prospective students who would rather
get tuition questions answered conversationally, embeddable on the
[Tuition & Financial Aid page](https://www.wts.edu/admissions/tuition-financial-aid).

## Goals

- **One-tag embed** for Webflow, same pattern as the tuition estimator: a
  single `<script>` tag pasted into an Embed element or site-wide custom code.
- Collapsed by default to a floating launcher button; expands to a chat panel;
  dismissible; remembers open/closed state during the visit.
- Calls the existing **Hedwig** admissions-bot backend (developed in
  `../hedwig-admissions-slackbot` alongside this repo) over HTTPS — the widget
  is frontend-only; auth/rate-limiting/data handling live server-side.
- Shadow DOM isolation so wts.edu styles and the widget never collide.

## Status

Not started — scaffolded here to reserve the spot in the monorepo. Development
will happen in a separate working session.
