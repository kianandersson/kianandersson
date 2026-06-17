# AGENTS.md

Things an agent cannot infer from reading the code. Everything else is implicit and omitted on purpose.

## Product

Personal CV / freelance landing page. Engineering discipline is the demonstration — pick the right tool, not the default.

**Print** must produce a clean CV: always light theme regardless of selection, chrome hidden, all collapsed content expanded.

## Architecture

Atomic Design layers.

- **Layouts** — chrome shell only.
- **Templates** — compose organisms. Never fetch data, never wire handlers.
- **Pages** — the only layer that calls `getCollection`, reads `site.config.ts`, binds handlers.
- **Components** — pure props in, JSX out. No global state, no config imports.

Preact components live under `src/components/{atoms,molecules,organisms}/` and are catalog-able in Storybook. Astro compositions (`templates/`, `layouts/`, `pages/`) are build-time and tested via Playwright on the rendered page.

Start static (zero JS). Add `client:*` in the template only when state, handlers, or effects require it.

**Rule of two.** A hook or atom is extracted only on the second consumer.

### Theme

JS only sets `document.documentElement.dataset.theme`. Tokens drive everything else.

## Testing

- **Vitest** — pure logic and islands, behavior-level.
- **Playwright** — flows + axe on `index.astro` and `404.astro`. No screenshot diff; visual regressions are caught by manual verification on those two pages.

Strict red-green-refactor on the Vitest layer. Playwright/axe are gates, not test-first targets.

- No snapshot tests.
- Tests describe behavior, not structure.
- No coverage gate.
- No Storybook.

Region/landmark assertions belong at the template or e2e layer, not in organism unit tests.

## Budget

- Lighthouse 100/100/100/100
- JS < 10 KB gzipped
- LCP < 1s

## Workflow

- PR-only to `main`, squash-merge. **PR title becomes the squash commit message.**
- Conventional Commits on PR titles.

## Principles

- Vertical slices, not horizontal layers.
- Match the scope of the request.
- Trust framework guarantees.
- No comments unless the WHY is non-obvious.
- English in all artifacts.
- Naming conventions: see `docs/naming-conventions.md`. Follow them.
