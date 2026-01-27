# OpenCode ClojureScript Plugin Template

This is a Shadow-CLJS starter template for writing OpenCode plugins using a data-first DSL.

## Build Commands

```bash
# Install dependencies
pnpm i

# Development build with hot reload
pnpm watch

# Production build
pnpm build

# Copy built plugin to OpenCode plugins directory
pnpm plugin:copy

# Symlink plugin for development (faster reload)
pnpm plugin:link

# Create new plugin from template
pnpm create my-new-plugin
```

**Output**: `dist/plugin.js` (ESM module with named export `MyPlugin`)

## Development Workflow

1. Run `pnpm watch` in one terminal for compilation
2. Run `pnpm plugin:copy` or `pnpm plugin:link` to deploy
3. Restart OpenCode to reload the plugin

## Project Structure

```
src/my/opencode/
├── entry.cljs          # Main plugin definition (named export)
├── dsl.cljs           # Plugin DSL macros
├── tool.cljs          # Tool definition helpers
├── schema.cljs        # Zod schema utilities
├── gate.cljs          # Permission gating
├── state.cljs         # Plugin state management
├── runtime.cljs       # Runtime utilities
├── perm.cljs          # Permission store
├── spec.cljs          # Plugin specifications
├── compose.cljs       # Fragment composition
└── fragments/         # Reusable plugin fragments
    ├── permission_store.cljs
    ├── shell_guard.cljs
    ├── deny_paths.cljs
    └── trace.cljs
```

## Code Style Guidelines

### Namespace Declarations
- Use kebab-case for namespace segments: `my.opencode.tool`
- Keep requires organized: builtins → external → internal
- Use `:require-macros` for macro namespaces
- Use `:refer` for frequently used symbols, `:as` for namespaces

### Function Definitions
- Use `defn` for named functions, `defn-` for private
- Add docstrings for public functions
- Use `^:private` metadata for private helpers
- Prefer pure functions when possible

### Data Structures
- Use maps for configuration and options
- Use keywords for keys: `{:description "..." :args {...}}`
- Use vectors for ordered data
- Use sets for membership testing

### JavaScript Interop
- Use `#js` literal for JavaScript objects: `#js {:description "..."}`
- Use `.-property` for property access: `(.-name args)`
- Use `(.method obj)` for method calls: `(-> client .-app (.log ...))`
- Use `clj->js` and `js->clj` for data conversion when needed

### Plugin DSL Patterns
```clojure
;; Tool definition
(def my-tool
  (t/deftool
   {:description "Tool description"
    :args {:param [:string {:min 1 :max 64}]}
    :execute (fn [args ctx] ...)}))

;; Plugin definition
(defplugin plugin*
  (init (fn [ctx] ...))
  (hook "event.name" (fn [ctx payload] ...))
  (tools {"tool-name" my-tool}))
```

### Schema Definitions
- Use the schema utilities in `schema.cljs`
- Field specs: `:string`, `[:string {:min 1 :max 32}]`
- Common types: `:string`, `:number`, `:boolean`, `:any`
- Validation mods: `:min`, `:max`, `:optional`, `:default`

### Error Handling
- Use permission gates for dangerous operations
- Return `nil` from init hooks when no state needed
- Use conditional logic for optional operations
- Log errors using the client logger when available

### Fragment Composition
- Create reusable fragments in `fragments/` namespace
- Each fragment returns a map with `:init` and/or `:hooks`
- Use fragments for cross-cutting concerns (logging, permissions, etc.)
- Import and compose fragments in main plugin definition

### Naming Conventions
- Files: kebab-case (`shell_guard.cljs`)
- Functions: kebab-case (`dangerous?`, `require!`)
- Variables: kebab-case (`danger-regexes`, `cmd`)
- Constants: upper-case with underscores when appropriate
- Plugin names: PascalCase for exports (`MyPlugin`)

### Testing
- No test framework currently configured
- Test plugins by loading into OpenCode
- Use `pnpm plugin:link` for rapid iteration
- Verify tool execution and hook behavior manually

### Dependencies
- Shadow-CLJS for compilation
- `@opencode-ai/plugin` for core plugin APIs
- `zod` for runtime validation
- Keep dependencies minimal

### Performance
- Use hooks efficiently - avoid expensive operations in hot paths
- Cache regex patterns and other expensive computations
- Use permission gates to prevent unnecessary dangerous operations
- Prefer lazy evaluation when appropriate