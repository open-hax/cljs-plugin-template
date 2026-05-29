---
uuid: "orgs-open-hax-archived-cljs-plugin-template-kanban-orgs-open-hax-archived-cljs-plugin-template-spec-dev-loop-md"
title: "Dev loop improvement plan"
status: incoming
priority: P3
labels: ["specs", "migrated-spec"]
created_at: "2026-05-29T04:01:14.187Z"
source: "orgs/open-hax/archived/cljs-plugin-template/spec/dev-loop.md"
category: "specs"
---

> Source: `orgs/open-hax/archived/cljs-plugin-template/spec/dev-loop.md`
> Migrated-to-kanban: `orgs/open-hax/archived/cljs-plugin-template/kanban/dev-loop.md`

# Dev loop improvement plan

## Requirements
- add a pm2 ecosystem config and helper script so `opencode serve` can be managed via PM2, keyed to a documented port `OPENCODE_DEV_PORT` (default 4096) and `OPENCODE_DEV_HOSTNAME`, and restart whenever `dist/plugin.js` changes
- expose the built plugin through `.opencode/plugins/index.js` (re-export `MyPlugin` from `dist/plugin.js`) and allow that path to be tracked despite the existing `.opencode/` entry in `.gitignore`
- document the new flow and environment variables in both `README.md` and `template/README.md` so template consumers understand how to run the PM2-backed dev loop

## Code files referenced
- `README.md:29-49` outlines the current manual copy-based dev loop that will be replaced
- `template/README.md:29-48` mirrors that section for generated plugins
- `package.json:6-10` defines the `watch`, `build`, and plugin copy/link scripts that back the workflow

## Existing issues
- none

## Existing PRs
- none

## Definition of done
- `pm2/ecosystem.config.mjs` plus `scripts/start-opencode-server.mjs` run `opencode serve` with the configured hostname/port, watch `dist/plugin.js`, and gracefully forward signals
- `.gitignore` selectively un-ignores `.opencode/plugins/` so the re-export index can be tracked, and `.opencode/plugins/index.js` simply re-exports `MyPlugin` from `dist/plugin.js`
- README files describe how to build, run, and configure the new PM2 dev loop plus the rerouting of `.opencode/plugins/index.js`
