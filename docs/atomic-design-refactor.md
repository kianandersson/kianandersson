# Atomic Design refactor — working plan

The first vertical slice of the Atomic Design refactor (issue #30, parent #29). This document is the **HITL gate**: it captures every concrete decision in the slice so the maintainer can veto individual choices before any other code is changed.

Naming follows [`docs/naming-conventions.md`](./naming-conventions.md). That document is the source of truth for token tiers, casing, and the two-layer primitive → semantic model. This plan only spells out the **project-specific** values, mappings, and snaps.

---

## 1. Extraction principle

> Prefer narrower purpose over broader. Consolidate shared logic only when purpose remains clear. When in doubt, two components — later consolidation is cheap; later disentanglement is expensive.

This principle governs every subsequent slice. It is not acted on in this slice.

---

## 2. Token system

### 2.1 Layers

| Token category | Layers in this slice                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Color          | Primitive (`--color-<hue>-<weight>`) + semantic (`--color-<role>-…`)    |
| Typography     | Primitive (`--font-size-<px>`) + semantic (`--text-<role>`)             |
| Spacing        | Primitive only (`--space-<n>`) — semantic aliases deferred              |
| Radius         | Semantic only (`--radius-<size>`) — small scale, no primitive layer     |

Components reference semantic tokens where they exist, and primitive `--space-N` directly (no semantic spacing aliases in this slice — they can be layered in later if the codebase grows enough usage patterns to justify them).

### 2.2 Color primitives

Three hue families (cream/warm-grey for warm light backgrounds, charcoal for text and cool dark backgrounds, terracotta for accent) plus green and amber for status. Weights follow Tailwind's 50–950 ramp, with half-step weights where the existing palette is finer-grained than the standard ramp.

```css
/* Cream / warm-grey */
--color-cream-50: #f4f3f1;
--color-warm-grey-100: #eceae5;
--color-warm-grey-200: #e4e2dd;
--color-white: #ffffff;

/* Charcoal — full ramp for both text (light) and surfaces (dark) */
--color-charcoal-50:  #f4f4f6;
--color-charcoal-400: #9e9ea6;
--color-charcoal-500: #828289;
--color-charcoal-600: #6a6a78;   /* current --faint (light) */
--color-charcoal-650: #65656b;   /* current --dim (light) */
--color-charcoal-700: #2c2c31;   /* current --line (dark) */
--color-charcoal-750: #2a2a2f;   /* current --chip (dark) */
--color-charcoal-800: #1f1f23;   /* current --surface (dark) */
--color-charcoal-900: #1d1d1f;   /* current --text (light) */
--color-charcoal-950: #17171a;   /* current --bg (dark) */

/* Terracotta */
--color-terracotta-500: #ef7351; /* dark accent */
--color-terracotta-600: #b03e24; /* light accent */

/* Status */
--color-green-500: #34a853;      /* ok (light) */
--color-green-400: #46c46e;      /* ok (dark) */
--color-amber-500: #cf9a3a;      /* warn (both themes) */
```

The 600/650 split on charcoal is intentional: the current palette uses two near-but-distinct mid-greys (`#6a6a78` slightly bluer, `#65656b` slightly greyer). Collapsing them would lose visible drift; keeping them costs one extra token.

### 2.3 Color semantics

Light theme:

```css
--color-bg-default:      var(--color-cream-50);          /* was --bg */
--color-surface-default: var(--color-white);             /* was --surface */
--color-surface-muted:   var(--color-warm-grey-100);     /* was --chip */
--color-text-default:    var(--color-charcoal-900);      /* was --text */
--color-text-muted:      var(--color-charcoal-650);      /* was --dim */
--color-text-subtle:     var(--color-charcoal-600);      /* was --faint */
--color-border-subtle:   var(--color-warm-grey-200);     /* was --line */
--color-accent-default:  var(--color-terracotta-600);    /* was --accent */
--color-accent-soft:     rgba(192, 69, 42, 0.1);         /* was --accent-soft */
--color-accent-line:     rgba(192, 69, 42, 0.3);         /* was --accent-line */
--color-status-ok:       var(--color-green-500);         /* was --ok */
--color-status-warn:     var(--color-amber-500);         /* was --warn */
--color-shadow-default:  rgba(0, 0, 0, 0.08);            /* was --shadow */
```

Dark theme overrides:

```css
--color-bg-default:      var(--color-charcoal-950);
--color-surface-default: var(--color-charcoal-800);
--color-surface-muted:   var(--color-charcoal-750);
--color-text-default:    var(--color-charcoal-50);
--color-text-muted:      var(--color-charcoal-400);
--color-text-subtle:     var(--color-charcoal-500);
--color-border-subtle:   var(--color-charcoal-700);
--color-accent-default:  var(--color-terracotta-500);
--color-accent-soft:     rgba(239, 115, 81, 0.16);
--color-accent-line:     rgba(239, 115, 81, 0.38);
--color-status-ok:       var(--color-green-400);
--color-status-warn:     var(--color-amber-500);
--color-shadow-default:  rgba(0, 0, 0, 0.5);
```

### 2.4 Token renames (the four)

| Old        | New                       | Reasoning                                                              |
| ---------- | ------------------------- | ---------------------------------------------------------------------- |
| `--chip`   | `--color-surface-muted`   | Locked by issue. The role is "muted surface", not "chip-specific".     |
| `--line`   | `--color-border-subtle`   | Used for hairlines and dividers — `border-subtle` matches the role.    |
| `--dim`    | `--color-text-muted`      | Used for secondary body text (slightly less prominent than default).   |
| `--faint`  | `--color-text-subtle`     | Used for tertiary text — captions, timestamps, section labels.         |

`--dim` is more visible than `--faint` in the current palette (hex `#65656b` vs `#6a6a78`); `muted` is conventionally more visible than `subtle`. The mapping preserves visual hierarchy.

Existing semantically-clean tokens (`--bg`, `--surface`, `--text`, `--accent`, `--accent-soft`, `--accent-line`, `--ok`, `--warn`, `--shadow`) are renamed to fit the `--color-<role>-<variant>` pattern but their **values are unchanged**.

### 2.5 Typography

Primitives — Tailwind-aligned, 16 px body baseline (WCAG-aligned):

```css
--font-size-12:  12px;
--font-size-14:  14px;
--font-size-16:  16px;   /* body baseline */
--font-size-18:  18px;
--font-size-20:  20px;
--font-size-24:  24px;
--font-size-30:  30px;
--font-size-36:  36px;
--font-size-48:  48px;
--font-size-60:  60px;
--font-size-72:  72px;
--font-size-96:  96px;
--font-size-128: 128px;
```

Semantics — role-based, assigned per current usage:

```css
--text-caption:  var(--font-size-12);  /* captions, eyebrows, dates, chip text */
--text-meta:     var(--font-size-14);  /* inline meta, secondary button text */
--text-body:     var(--font-size-16);  /* body baseline */
--text-subhead:  var(--font-size-18);  /* small subheadings */
--text-subtitle: var(--font-size-20);  /* role titles, hero subtitle */
--text-headline: var(--font-size-24);  /* section headlines */
--text-title:    var(--font-size-30);  /* page titles (404) */
--text-hero:     var(--font-size-36);  /* hero headline */
--text-display:  var(--font-size-60);  /* og-card display */
```

Primitives at 48 / 72 / 96 / 128 are defined but have no semantic alias yet — they exist on the scale for future use without requiring a token addition.

`line-height` is **not** tokenised in this slice (no existing line-height literals on a coherent scale yet). Out of scope.

### 2.6 Spacing

Primitives — linear 4 px base, max 64 (`--space-16`):

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-7:  28px;
--space-8:  32px;
--space-9:  36px;
--space-10: 40px;
--space-11: 44px;
--space-12: 48px;
--space-13: 52px;
--space-14: 56px;
--space-15: 60px;
--space-16: 64px;
```

Currently-unused entries (9, 12, 13, 14, 15) are defined for completeness. A maintainer veto on any of these is straightforward to apply.

**Escape hatch** (positioning only — `top` / `left` / `transform`):
`calc(var(--space-N) / 2)` allowed. Half-steps are 2, 6, 10, 14, 18, 22, 26, 30 px. Padding, margin, and gap must hit the scale directly.

### 2.7 Radius

Semantic-only (no primitive layer — the scale is small enough):

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-full: 50%;
--radius-pill: 980px;
```

`--radius-pill` is a project-specific addition for fully rounded pill shapes (the CTA button, availability pill, send button) — `border-radius: 50%` only produces a circle on square boxes; pills need an effectively-infinite radius.

### 2.8 No shadow scale

The design is flat. Existing `box-shadow` usages remain inline in component CSS as illustration-layer:

- `StatusDot.module.css:8,13` — 3 px focus-ring-style soft glow around the dot
- `TimelineMarker.module.css:9` — 4 px soft glow around the marker
- `ContactForm.module.css:121` — `0 0 0 1000px var(--surface) inset` autofill mask

These do **not** form a coherent scale and stay component-local.

---

## 3. Snap list

Every off-scale value with the proposed target. The maintainer can veto any individual snap before execution; vetoed snaps are excluded from the migration and the original value stays (escalating to a follow-up issue if structurally needed).

### 3.1 Typography snaps

Snap rules from the issue: `11 → 12`, `13 → 14`, `15 → 16`, `19 → 20`, `28 → 30`, `38 → 36`, `58 → 60`. Values already on the scale (`12, 14, 16, 18, 20, 24`) do not snap.

| file:line                                          | current | snap to | semantic token  |
| -------------------------------------------------- | ------- | ------- | --------------- |
| `Experience/Experience.module.css:18`              | 15      | 16      | `--text-body`     |
| `Experience/Experience.module.css:73`              | 19      | 20      | `--text-subtitle` |
| `Experience/Experience.module.css:101`             | 15      | 16      | `--text-body`     |
| `KeySkills/KeySkills.module.css:48`                | 15      | 16      | `--text-body`     |
| `NotFound/NotFound.module.css:18`                  | 15      | 16      | `--text-body`     |
| `NotFound/NotFound.module.css:32`                  | 28      | 30      | `--text-title`    |
| `NotFound/NotFound.module.css:85`                  | 11      | 12      | `--text-caption`  |
| `NotFound/NotFound.module.css:94`                  | 13      | 14      | `--text-meta`     |
| `ContactForm/ContactForm.module.css:77`            | 13      | 14      | `--text-meta`     |
| `ContactForm/ContactForm.module.css:92`            | 15      | 16      | `--text-body`     |
| `ContactForm/ContactForm.module.css:162`           | 15      | 16      | `--text-body`     |
| `Accordion/Accordion.module.css:44`                | 15      | 16      | `--text-body`     |
| `OpenGraphCard/OpenGraphCard.module.css:28`        | 58      | 60      | `--text-display`  |
| `AvailabilityPill/AvailabilityPill.module.css:12`  | 15      | 16      | `--text-body`     |
| `AvailabilityPill/AvailabilityPill.module.css:25`  | 13      | 14      | `--text-meta`     |
| `Miscellaneous/Miscellaneous.module.css:17`        | 15      | 16      | `--text-body`     |
| `SkillGroups/SkillGroups.module.css:18`            | 15      | 16      | `--text-body`     |
| `ContactCta/ContactCta.module.css:125`             | 15      | 16      | `--text-body`     |
| `ContactCta/ContactCta.module.css:275`             | 15      | 16      | `--text-body`     |
| `Hero/Hero.astro:40`                               | 38      | 36      | `--text-hero`     |
| `Hero/Hero.astro:54`                               | 19      | 20      | `--text-subtitle` |
| `SkillRow/SkillRow.module.css:13`                  | 15      | 16      | `--text-body`     |
| `CtaButton/CtaButton.module.css:6`                 | 15      | 16      | `--text-body`     |

### 3.2 Spacing snaps

Linear 4 px scale. Equidistant ties (e.g. 14 between 12 and 16) snap **up** by default to preserve visual breathing room.

| file:line                                          | current        | snap to        | notes                                  |
| -------------------------------------------------- | -------------- | -------------- | -------------------------------------- |
| `Footer/Footer.module.css:24`                      | `gap: 6px`     | `gap: 8px`     | `--space-2`                            |
| `NotFound/NotFound.module.css:59`                  | `gap: 9px`     | `gap: 8px`     | `--space-2`                            |
| `NotFound/NotFound.module.css:60`                  | `padding: 11px 15px` | `padding: 12px 16px` | `--space-3 --space-4`         |
| `NotFound/NotFound.module.css:83`                  | `margin-left: 6px` | `margin-left: 8px` | `--space-2`                       |
| `ContactForm/ContactForm.module.css:15`            | `gap: 9px`     | `gap: 8px`     | `--space-2`                            |
| `ContactForm/ContactForm.module.css:16`            | `padding: 11px 15px` | `padding: 12px 16px` | `--space-3 --space-4`         |
| `ContactForm/ContactForm.module.css:46`            | `gap: 14px`    | `gap: 16px`    | `--space-4` (tie, rounds up)            |
| `ContactForm/ContactForm.module.css:47`            | `padding: 11px 16px` | `padding: 12px 16px` | `--space-3 --space-4`         |
| `ContactForm/ContactForm.module.css:56`            | `padding: 14px 16px` | `padding: 16px 16px` | `--space-4 --space-4` (tie, up) |
| `ContactForm/ContactForm.module.css:72`            | `padding: 0 13px 0 11px` | `padding: 0 12px 0 12px` | `0 --space-3 0 --space-3` |
| `ContactForm/ContactForm.module.css:102`           | `padding: 11px 0` | `padding: 12px 0` | `--space-3 0`                      |
| `ContactForm/ContactForm.module.css:138`           | `gap: 14px`    | `gap: 16px`    | `--space-4` (tie, rounds up)            |
| `ContactForm/ContactForm.module.css:153`           | `gap: 9px`     | `gap: 8px`     | `--space-2`                            |
| `ContactForm/ContactForm.module.css:156`           | `padding: 0 22px` | `padding: 0 24px` | `0 --space-6` (tie, rounds up)     |
| `Miscellaneous/Miscellaneous.module.css:35`        | `padding-top: 18px` | `padding-top: 20px` | `--space-5` (tie, rounds up)    |
| `Miscellaneous/Miscellaneous.module.css:51`        | `gap: 10px`    | `gap: 12px`    | `--space-3` (tie, rounds up)            |
| `Miscellaneous/Miscellaneous.module.css:58`        | `gap: 9px`     | `gap: 8px`     | `--space-2`                            |
| `Miscellaneous/Miscellaneous.module.css:59`        | `padding: 7px 13px` | `padding: 8px 12px` | `--space-2 --space-3`           |
| `AvailabilityPill/AvailabilityPill.module.css:4`   | `gap: 10px`    | `gap: 12px`    | `--space-3` (tie, rounds up)            |
| `AvailabilityPill/AvailabilityPill.module.css:6`   | `padding: 0 18px` | `padding: 0 20px` | `0 --space-5` (tie, rounds up)     |
| `AvailabilityPill/AvailabilityPill.module.css:19`  | `gap: 6px`     | `gap: 8px`     | `--space-2`                            |
| `OpenGraphCard/OpenGraphCard.module.css:9`         | `padding: 38px 40px` | `padding: 40px 40px` | `--space-10 --space-10`       |
| `OpenGraphCard/OpenGraphCard.module.css:24`        | `gap: 14px`    | `gap: 16px`    | `--space-4` (tie, rounds up)            |
| `OpenGraphCard/OpenGraphCard.module.css:45`        | `gap: 6px`     | `gap: 8px`     | `--space-2`                            |
| `ContactCta/ContactCta.module.css:119`             | `padding: 0 22px` | `padding: 0 24px` | `0 --space-6` (tie, rounds up)     |

### 3.3 Radius snaps

| file:line                          | current | snap to | semantic         |
| ---------------------------------- | ------- | ------- | ---------------- |
| `Footer/Footer.module.css:29`      | 2px     | 4px     | `--radius-sm`    |

All other `border-radius` values (`4`, `8`, `12`, `50%`, `980px`) already map cleanly to a semantic token.

### 3.4 Positioning escape-hatch usages

`top` / `left` / `transform` values that need the `calc(var(--space-N) / 2)` escape hatch (currently-used half-steps only):

| file:line                                          | current             | replacement                                | notes                |
| -------------------------------------------------- | ------------------- | ------------------------------------------ | -------------------- |
| `CtaButton/CtaButton.module.css:43`                | `translateX(-6px)`  | `translateX(calc(var(--space-3) * -0.5))`  | 6 = 12/2             |
| `CtaButton/CtaButton.module.css:47`                | `translateX(6px)`   | `translateX(calc(var(--space-3) / 2))`     | 6 = 12/2             |

Snapped-to-scale positioning values:

| file:line                                          | current             | replacement              |
| -------------------------------------------------- | ------------------- | ------------------------ |
| `Experience/Experience.module.css:40`              | `left: 4px`         | `left: var(--space-1)`   |
| `Experience/Experience.module.css:41`              | `top: 40px`         | `top: var(--space-10)`   |
| `Experience/Experience.module.css:42`              | `bottom: 8px`       | `bottom: var(--space-2)` |
| `TimelineMarker/TimelineMarker.module.css:3`       | `left: -31px`       | `left: calc(var(--space-8) * -1)` (snap −31 → −32) |
| `TimelineMarker/TimelineMarker.module.css:4`       | `top: 8px`          | `top: var(--space-2)`    |
| `ContactCta/ContactCta.module.css:69`              | `translateX(-12px)` | `translateX(calc(var(--space-3) * -1))`  |
| `ContactCta/ContactCta.module.css:80`              | `translateX(12px)`  | `translateX(var(--space-3))`             |
| `ContactCta/ContactCta.module.css:95`              | `translateX(12px)`  | `translateX(var(--space-3))`             |
| `ContactCta/ContactCta.module.css:154`             | `translateX(-12px)` | `translateX(calc(var(--space-3) * -1))`  |
| `ContactCta/ContactCta.module.css:255`             | `translateY(-8px)`  | `translateY(calc(var(--space-2) * -1))`  |
| `ContactCta/ContactCta.module.css:286`             | `translateY(-12px)` | `translateY(calc(var(--space-3) * -1))`  |
| `ContactCta/ContactCta.module.css:301`             | `translateY(-12px)` | `translateY(calc(var(--space-3) * -1))`  |

### 3.5 Illustration-layer exceptions

Decorative or micro-aligned values where snapping would visibly break intent. Stay as raw px, documented as exceptions in the migration commit.

| file:line                                              | value                                       | reason                                                                     |
| ------------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------- |
| `ContactCta/ContactCta.module.css:165`                 | `margin-top: -1px`                          | 1 px optical alignment for stacked arrow/X icons; escape hatch is positioning-only and 1 px is below half-step. |
| `ContactForm/ContactForm.module.css:190`               | `transform: translate(1px, -1px)`           | 1 px paper-plane hover micro-jiggle; below half-step.                       |
| `ContactForm/ContactForm.module.css:200`               | `transform: translate(26px, -26px) rotate(8deg)` | Paper-plane fly-off keyframe; rotation in degrees, translate is decorative motion. Snapping to 24 visibly changes the animation. |
| `StatusDot/StatusDot.module.css:8`                     | `box-shadow: 0 0 0 3px …`                   | Focus-ring-style glow; no shadow scale.                                     |
| `StatusDot/StatusDot.module.css:13`                    | `box-shadow: 0 0 0 3px …`                   | As above.                                                                  |
| `TimelineMarker/TimelineMarker.module.css:9`           | `box-shadow: 0 0 0 4px …`                   | Timeline-indicator glow; no shadow scale.                                  |
| `ContactForm/ContactForm.module.css:121`               | `-webkit-box-shadow: 0 0 0 1000px … inset`  | Autofill background-color mask (Safari).                                   |
| `Footer/Footer.module.css:29`                          | `width: 2px; height: 2px`                   | Out of scope (width/height not in the snap rules); 2 px micro-bullet kept as-is. |

### 3.6 Out of scope in this slice

- **`width` / `height` / `min-height` / `max-width`** literals (e.g. `width: 36px`, `min-height: 120px`, `max-width: 540px`). The issue scope is `font-size`, `padding`, `margin`, `gap`, `border-radius`, `top`, `left`, and `transform`. Width/height literals are flagged for a future slice — many are component-intrinsic sizes that may or may not benefit from tokenisation.
- **Line-height tokens.** Not in current use as literals on a coherent scale.
- **Component folder reorganisation.** All CSS Modules stay at `src/components/<Name>/<Name>.module.css`. The folder mapping below is informational for the next slice.

### 3.7 Reported as bug candidates (no fix in this slice)

None at this stage. The off-scale values found all fit the snap rules above.

---

## 4. Folder mapping (informational — for the next slice)

Proposed atoms / molecules / organisms split. Listed but **not acted on** in this slice. The extraction principle (§1) governs disagreements.

| Component         | Layer     | Reasoning                                                         |
| ----------------- | --------- | ----------------------------------------------------------------- |
| `Chip`            | atom      | Single-purpose label.                                             |
| `StatusDot`       | atom      | Single-purpose visual indicator.                                  |
| `TimelineMarker`  | atom      | Single-purpose positioned dot.                                    |
| `LevelMeter`      | atom      | Single-purpose skill-level dots.                                  |
| `CtaButton`       | atom      | Classic button atom.                                              |
| `AvailabilityPill`| atom      | Self-contained pill; doesn't currently compose other atoms.       |
| `Accordion`       | molecule  | Composes summary + content.                                       |
| `ChipList`        | molecule  | Composes `Chip` + label + collapse toggle.                        |
| `PrintButton`     | molecule  | Composes button affordance + icon.                                |
| `SkillRow`        | molecule  | Composes `LevelMeter` + name + meta.                              |
| `ThemeToggle`     | molecule  | Composes button + icon.                                           |
| `OpenGraphCard`   | molecule  | Self-contained card composing several primitives.                 |
| `ContactForm`     | organism  | Multi-field form; significant behavior.                           |
| `ContactCta`      | organism  | Composes `AvailabilityPill` + `ContactForm` + CTA logic.          |
| `Hero`            | organism  | Page-section composing typography.                                |
| `Experience`      | organism  | Page-section listing experience entries.                          |
| `KeySkills`       | organism  | Page-section composing `Chip` + headings.                         |
| `SkillGroups`     | organism  | Page-section composing `SkillRow`.                                |
| `Miscellaneous`   | organism  | Page-section composing chips + headings.                          |
| `NotFound`        | organism  | Full 404 section.                                                 |
| `TopBar`          | organism  | Page chrome — left/right slots.                                   |
| `Footer`          | organism  | Page chrome — bottom.                                             |

Total: 6 atoms, 6 molecules, 10 organisms = 22 components. (The issue body referenced "19 existing components" — actual count today is 22; difference is likely from prior bundling of `AvailabilityPill` / `ContactCta` / `ContactForm`.)

---

## 5. `AGENTS.md` updates (in scope)

Two changes, applied with the token migration commit:

1. Replace the inaccurate testing line ("Playwright — flows, screenshot diff (one per breakpoint per page), axe in every e2e.") with the actual coverage. Current Playwright coverage is `index.astro` and `404.astro` flows + axe; **no screenshot diff exists today**. Manual visual verification on those two pages is the gate.
2. Add a one-liner under Architecture or Principles: "Naming conventions: see `docs/naming-conventions.md`. Follow them."

---

## 6. Acceptance gate

Before any commit beyond this document lands, the maintainer must:

- [ ] Approve every typography snap in §3.1 (or veto specific lines).
- [ ] Approve every spacing snap in §3.2 (or veto specific lines — equidistant ties round up by default; flag any where rounding down is preferred).
- [ ] Approve the single radius snap in §3.3.
- [ ] Approve the four token renames in §2.4 (`--dim` → `--color-text-muted`, `--faint` → `--color-text-subtle`).
- [ ] Approve the color primitive palette in §2.2 (especially the charcoal 600/650 split).
- [ ] Approve the typography semantic names in §2.5 (`--text-caption`, `--text-meta`, `--text-body`, `--text-subhead`, `--text-subtitle`, `--text-headline`, `--text-title`, `--text-hero`, `--text-display`).
- [ ] Approve the illustration-layer exceptions in §3.5.

After approval, subsequent commits on this branch implement the migration in this order:

1. Rewrite `src/styles/tokens.css` with primitive + semantic layers (no component changes).
2. Apply the four renames across every consuming CSS Module.
3. Apply approved snaps + token references in component CSS, one component or small group per commit.
4. Update `AGENTS.md` per §5.
5. Run gates (`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:bundle`, `pnpm test:e2e`) and request manual verification on `index.astro` + `404.astro`.
