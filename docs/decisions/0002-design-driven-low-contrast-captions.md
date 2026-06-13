# 0002 — Faint caption colour, design-aligned and AA-compliant

Status: accepted, 2026-06-13
Context: PR #3 (Experience section). The reference design
(`design/index.dc.html`) uses very small monospaced captions — period dates
and chip-group labels at 11–12 px — in `--faint` (`#9b9ba1` light,
`#68686f` dark). Both fall below WCAG AA's 4.5:1 floor for small text on the
respective backgrounds (2.49:1 light, 3.27:1 dark).

The accessibility gate is non-negotiable. The design's visual hierarchy
(meta > period; chip text > group label) must survive.

## Decision

Pick `--faint` values that hit WCAG AA on each theme's background while
preserving the design's cool blue-grey hue and a visible step away from
`--dim`:

- **Light**: `--faint: #6a6a78` — 4.72:1 on `--bg #f4f3f1`. Hue keeps the
  design's slight blue bias (B 0x78 > R/G 0x6a). Sits between `--dim`
  (`#65656b`, 5.31:1) and the AA floor (~`#727280`).
- **Dark**: `--faint: #828289` — 4.74:1 on `--bg #17171a`. Same cool tilt
  (B 0x89 > R/G 0x82), comfortably below `--dim` (`#9e9ea6`, 5.99:1).

`--accent` in light mode also shifts from `#c0452a` to `#b03e24` (ΔE ~3)
so chip-stack text (accent on `--accent-soft`) reaches 4.54:1 instead of
4.02. Dark `--accent` (`#ef7351`) already passed and stays.

## Why not the design colours

Both design `--faint` values are well below 4.5:1. Three alternatives were
weighed:

1. **Honour the design exactly and exclude the elements from axe.** Earlier
   draft of this PR. Rejected — accessibility is not a place for opt-out
   decoration. A `data-axe-faint` attribute moves the violation from
   "automated check" to "documented exception", which is a downgrade.
2. **Disable the `color-contrast` rule globally.** Worse than (1); blinds
   the audit to every other element on the page.
3. **Pick the closest AA-compliant colour and accept the visual delta.**
   The design's faint is a stylistic choice, not a brand requirement.
   Bringing the hue along (cool blue-grey) preserves the *kind* of hierarchy
   the design encodes; the absolute lightness shifts because physics
   demands it.

(3) is the only option that keeps both the gate and the spirit of the
design.

## Consequences

- Period dates and chip labels are noticeably darker than the design
  prototype but still distinguishable from meta text. The hierarchy
  collapses from "ghost text" to "subtle subordinate" — a real visual
  change.
- All axe `color-contrast` checks run unmodified across the whole page.
- The `--faint` token is now genuinely usable for any small caption text
  without per-element opt-outs.

## Related

- [0001](0001-preact-for-islands.md) — the other CI-gate-vs-design tension
  this PR resolved.
- `--accent` darkened to `#b03e24` (light only) as a separate concession for
  the same WCAG AA pressure; documented inline here rather than its own ADR
  because it's a single token tweak.
