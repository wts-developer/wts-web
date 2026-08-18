# wts-web

See [AGENTS.md](AGENTS.md) for the full briefing: what this repo is,
the data policy, ground rules, dev servers, verification, and the PR
process. That file is the primary orientation for any AI coding agent
(Claude Code, Codex, Copilot, Cursor, Aider) working here.

## Branch and PR discipline

Never work directly on `main`: cut a branch from up-to-date
`origin/main` before your first edit, for features, bug fixes, and
docs alike. Every change lands through a PR with at least one human
approval. Agents stop at the PR: never merge one (not even your own).
Merging deploys to the public UAT link via GitHub Pages.

## Data policy in one line

Public data only; agents never call the Hedwig API or any Westminster
system, and hand humans the exact command instead. Details:
[AGENTS.md](AGENTS.md#data-policy-ferpa-and-the-westminster-ai-acceptable-use-policy).
