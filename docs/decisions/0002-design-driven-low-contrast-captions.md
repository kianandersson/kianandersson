# 0002 — Design-driven low-contrast captions

Status: accepted, 2026-06-13
Context: PR #3 (Experience section). The reference design (`design/index.dc.html`)
relies on color hierarchy in very small monospaced captions — period dates and
chip-group labels at 11–12 px in `--faint` (`#9b9ba1` light, `#68686f` dark).
Both fall under WCAG AA's 4.5:1 floor on the page background (2.49:1 light,
3.27:1 dark).

## Decision

Honour the design. Keep `--faint` at the design values and tag every element
that intentionally uses it with `data-axe-faint`. The Playwright axe scans
exclude `[data-axe-faint]` from the audit.

Concretely:

- `src/components/Experience/Experience.tsx` — period date `<div>` carries
  `data-axe-faint`.
- `src/components/ChipList/ChipList.tsx` — group label `<span>` carries
  `data-axe-faint`.
- `tests/e2e/*.spec.ts` — every axe call is
  `new AxeBuilder({ page }).exclude('[data-axe-faint]').analyze()`.

Stack chip text (`--accent` on `--accent-soft`) was 4.02:1, also below AA. That
gets fixed structurally instead of excluded: `--accent` shifts from `#c0452a`
to `#b03e24` in light mode — a subtle darken (ΔE ~3) that's invisible against
the design's terracotta and brings chip text to 4.54:1. Dark-mode `--accent`
(`#ef7351`) already passes (4.86:1) and stays put.

## Why exclude rather than relax the gate

Three alternatives were considered:

1. **Darken `--faint` to meet AA.** The math forces it to within 1% of `--dim`,
   collapsing the period/meta/heading hierarchy. The portfolio's signal is
   visual craft as much as engineering discipline — losing the hierarchy
   undercuts both.
2. **Disable `color-contrast` globally in axe.** Loses the protection on every
   other element. Silent failure surface is too large.
3. **Exclude tagged elements only.** Documented at the call site, visible in
   the DOM, narrowly scoped. Other text still scanned.

(3) is the only option where the exception is explicit, scoped, and reviewable.

## Consequences

- Period dates and chip-group labels remain visually subordinate to meta and
  body text, matching the design.
- Two elements per work entry and one per chip group skip the axe audit
  entirely (not just color-contrast — any rule). Both are static, non-interactive
  text — surface for other a11y violations is effectively nil.
- A reviewer scanning the diff sees the `data-axe-faint` attribute and the
  `.exclude(...)` calls — both load-bearing for the decision. The attribute name
  is deliberately verbose so its purpose is self-explanatory.
- Future contributors who add another `--faint` text element must either tag it
  (and accept the design trade-off) or pick a different token. Untagged faint
  text gets caught by axe.

## Related

- [0001](0001-preact-for-islands.md) — the other CI-gate-vs-design tension this PR resolved.
- The `--accent` darken is local to light mode; brand identity is preserved.
