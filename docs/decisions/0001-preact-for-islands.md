# 0001 — Preact (with React compat) for client islands

Status: accepted, 2026-06-13
Context: PR #3 (Experience + ChipList island), first PR to hydrate any component.

## Decision

Swap `@astrojs/react` for `@astrojs/preact` with `compat: true`. TSX components keep
importing from `react` and `react-dom`; both resolve to `preact/compat` via the
integration. For Vitest, `vitest.config.ts` mirrors the alias, and the test layer uses
`@testing-library/preact` (the React equivalent fails to render once `react-dom` is
aliased to `preact/compat`).

## Why

The bundle-size CI gate caps JS shipped to users at 10 KB gzipped. A single React 19
island ships ~58 KB gzipped — runtime + scheduler + JSX dev shims, mostly unavoidable.
Preact with compat ships ~5 KB gzipped including the same React-flavoured surface
(`useState`, `useCallback`, hooks, JSX).

The two CI gates `@astrojs/react` and `JS < 10 KB gzipped` cannot both hold. Of the
three resolutions considered:

- **Preact + compat** — minimal source diff, smallest bundle, full TSX/hook ergonomics.
- **Vanilla JS toggle** — zero bundle, but kills the `useExpand` hook that PR #4's
  `Accordion` was planned to share.
- **Relax the bundle gate** — contradicts the "engineering quality is the portfolio
  signal" positioning in `AGENTS.md`.

Preact wins on all three axes that matter: source impact, bundle impact, future shape.

## Consequences

- Components stay `.tsx` and keep `react` imports — no rewrites.
- Test files import from `@testing-library/preact`. RTL queries (`getByRole`, `screen`,
  `userEvent`) work identically.
- PR #4's `Accordion` reuses `useExpand` unchanged.
- `@astrojs/react` and the `react`/`react-dom` packages are removed from the project.
- Tradeoffs: lose the React 19 ecosystem (Suspense streaming, RSC, future React
  Compiler). None of that is on the V1 roadmap; revisit if Preact ever blocks a
  feature the project actually needs.

## Updates required elsewhere

- `AGENTS.md` mentions "React for all components under `src/components/`". The
  identifier still reads "React" but the runtime is Preact via compat. Reword to
  "React-flavoured TSX components, rendered by Preact (see [0001](decisions/0001-preact-for-islands.md))"
  when convenient. Not a load-bearing rename.
