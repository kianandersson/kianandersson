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

Preact components live under `src/components/{atoms,molecules,organisms}/` and are cataloged in Storybook (`pnpm storybook`). `src/components/index.ts` is the public barrel — import from there. Astro compositions (`templates/`, `layouts/`, `pages/`) are build-time and tested via Playwright on the rendered page; they have no Storybook stories because the Preact-Vite framework cannot render them.

Before implementing a new component, check Storybook (and `src/components/index.ts`) for an existing atom/molecule/organism that already covers it — extend or reuse before adding.

Start static (zero JS). Add `client:*` in the template only when state, handlers, or effects require it.

**Rule of two.** A hook or atom is extracted only on the second consumer.

### Theme

JS only sets `document.documentElement.dataset.theme`. Tokens drive everything else.

## Testing

Layered. Each tool owns one job:

- **Vitest (node)** — pure logic in `lib/`. Date/period/skill formatting, JSON-LD, validation.
- **Storybook + addon-vitest (Chromium browser-mode)** — every component variant, in real CSS, in a real browser. Each story carries its contract via `play()`. `addon-a11y` gates the build at `'error'`; new stories must pass axe with no opt-outs.
- **Playwright** — page flows on Chromium, Firefox, WebKit, and mobile-Chrome. Hydration smoke, page-level axe on `/` and `/404`, layout overflow at 360px, contact-form submit flow via `page.route()` mock (no live Resend).
- **Lighthouse CI** — the four 100s.
- **bundle-size guard** — JS < 10 KB gzipped on `_astro/<name>.js` files referenced from rendered HTML.

The catalog ships at `/design/` on every preview and production deploy — reviewers point a browser there to scan variants the page-level axe gate can't see (e.g. the contact form region is `inert` until the user opens it).

Strict red-green-refactor for new `lib/` logic and for component contracts going into stories' `play()`. Playwright + Lighthouse + bundle-size are gates, not test-first targets.

- No snapshot tests.
- Tests describe behavior, not structure.
- No coverage gate.
- Region/landmark assertions belong at the template or e2e layer, not in component-level tests.

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
