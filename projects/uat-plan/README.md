# uat-plan

Publishes the Tuition Calculator + Chatbot UAT plan to Notion as a hub
page with two inline databases: a seeded Test Cases table (17 focused
cases across Calculator, Chatbot, Cross-check, and Mobile) and an empty
Bug Reports table for testers.

## One-time Notion setup

1. Create an internal integration at
   <https://www.notion.so/my-integrations> in the WTS workspace; copy the
   secret token.
2. On the Notion page that should contain the plan: the `...` menu, then
   Connections, then add the integration.
3. Copy that page's id from its URL (the trailing 32 hex characters).

## Publish

Copy `.env.example` to `.env` in this directory, paste in your token and
parent page id (both gitignored), then:

```sh
python3 projects/uat-plan/publish_notion.py
```

Environment variables with the same names override `.env` if both exist.

Prints the new page URL. Rerunning creates a fresh page (nothing is
overwritten); delete superseded copies in Notion.

Standard library only, like the rest of this repo. Content lives in
`publish_notion.py` (`PAGE_BLOCKS` and `CASES`); edit and rerun to
iterate. Expected numbers in the seeded cases reflect the calculator as
of the AY27-28 scholarship transition; update them alongside future
policy changes.
