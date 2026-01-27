# OpenCode Shadow-CLJS Plugin DSL (Template)

This repo is a **Shadow-CLJS** starter for writing **OpenCode plugins** using a small **data-first DSL**.

## What you get

- `defplugin` macro DSL for composing plugin fragments
- Hook chaining (multiple fragments can attach to the same hook)
- `ctx` injection into hooks (handlers receive `ctx` first)
- Custom tools with **Zod** argument schemas
- Fragments for:
  - permission store
  - deny-path reads
  - shell guard (dangerous commands require permission)
  - trace logging

## Build

```bash
pnpm i
pnpm build
```

Output: `dist/plugin.js`

## Use as a local plugin

```bash
mkdir -p .opencode/plugins
cp dist/plugin.js .opencode/plugins/my-plugin.js
```

OpenCode will load local plugins from:

- `.opencode/plugins/` (project)
- `~/.config/opencode/plugins/` (global)

Your plugin is exported as a **named export**: `MyPlugin`.

## Dev loop

```bash
pnpm watch
# in another terminal:
pnpm plugin:copy
```

Then restart OpenCode to reload.

## Create a new plugin from the template

This repo also includes a tiny generator:

```bash
pnpm create my-new-plugin
```

It copies `template/` into `./my-new-plugin/` and sets the package name.
