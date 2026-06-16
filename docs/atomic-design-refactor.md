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

Every category gets both layers in this slice:

| Category    | Primitive layer                  | Semantic layer                                |
| ----------- | -------------------------------- | --------------------------------------------- |
| Color       | `--color-<hue>-<weight>`         | `--color-<role>-<variant>`                    |
| Typography  | `--font-size-<n>`, `--line-height-<n>` | `--text-<role>-size`, `--text-<role>-leading` |
| Spacing     | `--space-<n>`                    | `--space-<t-shirt>`                           |
| Radius      | `--radius-<n>`                   | `--radius-<t-shirt>`                          |

Components reference **only semantic tokens**. Primitives are referenced only inside `tokens.css` and inside the positioning escape hatch (`calc(var(--space-N) / 2)`).

### 2.2 Color primitives

Three hue families plus status colors. Weights follow Tailwind's 50–950 ramp, with half-step weights where the existing palette is finer-grained than the standard ramp.

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

Alpha-blended semantics use `color-mix(in srgb, …, transparent)` so they reference primitives instead of carrying raw hex.

Light theme:

```css
--color-bg-default:      var(--color-cream-50);
--color-surface-default: var(--color-white);
--color-surface-muted:   var(--color-warm-grey-100);   /* was --chip */
--color-text-default:    var(--color-charcoal-900);
--color-text-muted:      var(--color-charcoal-650);    /* was --dim */
--color-text-subtle:     var(--color-charcoal-600);    /* was --faint */
--color-border-subtle:   var(--color-warm-grey-200);   /* was --line */
--color-accent-default:  var(--color-terracotta-600);
--color-accent-soft:     color-mix(in srgb, var(--color-terracotta-600) 10%, transparent);
--color-accent-line:     color-mix(in srgb, var(--color-terracotta-600) 30%, transparent);
--color-status-ok:       var(--color-green-500);
--color-status-warn:     var(--color-amber-500);
--color-shadow-default:  color-mix(in srgb, black 8%, transparent);
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
--color-accent-soft:     color-mix(in srgb, var(--color-terracotta-500) 16%, transparent);
--color-accent-line:     color-mix(in srgb, var(--color-terracotta-500) 38%, transparent);
--color-status-ok:       var(--color-green-400);
--color-status-warn:     var(--color-amber-500);
--color-shadow-default:  color-mix(in srgb, black 50%, transparent);
```

`color-mix` has Baseline support (Safari 16.4+, Chrome 111+, Firefox 113+ — all 2023). No fallback required.

### 2.4 Token renames (the four)

| Old        | New                       | Reasoning                                                              |
| ---------- | ------------------------- | ---------------------------------------------------------------------- |
| `--chip`   | `--color-surface-muted`   | Locked by issue. The role is "muted surface", not "chip-specific".     |
| `--line`   | `--color-border-subtle`   | Used for hairlines and dividers — `border-subtle` matches the role.    |
| `--dim`    | `--color-text-muted`      | Used for secondary body text (slightly less prominent than default).   |
| `--faint`  | `--color-text-subtle`     | Used for tertiary text — captions, timestamps, section labels.         |

`--dim` is visibly more prominent than `--faint` in the current palette (hex `#65656b` vs `#6a6a78`); `muted` is conventionally more prominent than `subtle`. The mapping preserves visual hierarchy.

### 2.5 Typography

#### Font-size primitives

Tailwind-aligned scale, numeric tiers from `100` (smallest) upward in steps of `100`:

```css
--font-size-100:  12px;
--font-size-200:  14px;
--font-size-300:  16px;   /* body baseline */
--font-size-400:  18px;
--font-size-500:  20px;
--font-size-600:  24px;
--font-size-700:  30px;
--font-size-800:  36px;
--font-size-900:  48px;
--font-size-1000: 60px;
--font-size-1100: 72px;
--font-size-1200: 96px;
--font-size-1300: 128px;
```

#### Line-height primitives

Unitless multipliers (so they scale with the cascading font-size):

```css
--line-height-100: 1;       /* tight (display/hero) */
--line-height-200: 1.25;    /* snug (titles, headlines) */
--line-height-300: 1.375;   /* normal */
--line-height-400: 1.5;     /* comfortable (captions, meta, subheads) */
--line-height-500: 1.625;   /* relaxed (body, subtitles) */
--line-height-600: 2;       /* spacious (loose summaries) */
```

#### Typography semantics

Each role gets a `-size` and a `-leading` token:

```css
--text-caption-size:    var(--font-size-100);   /* 12 */
--text-caption-leading: var(--line-height-400); /* 1.5 */

--text-meta-size:       var(--font-size-200);   /* 14 */
--text-meta-leading:    var(--line-height-400); /* 1.5 */

--text-body-size:       var(--font-size-300);   /* 16 */
--text-body-leading:    var(--line-height-500); /* 1.625 */

--text-subhead-size:    var(--font-size-400);   /* 18 */
--text-subhead-leading: var(--line-height-400); /* 1.5 */

--text-subtitle-size:   var(--font-size-500);   /* 20 */
--text-subtitle-leading:var(--line-height-500); /* 1.625 */

--text-headline-size:   var(--font-size-600);   /* 24 */
--text-headline-leading:var(--line-height-200); /* 1.25 */

--text-title-size:      var(--font-size-700);   /* 30 */
--text-title-leading:   var(--line-height-200); /* 1.25 */

--text-hero-size:       var(--font-size-800);   /* 36 */
--text-hero-leading:    var(--line-height-200); /* 1.25 */

--text-display-size:    var(--font-size-1000);  /* 60 */
--text-display-leading: var(--line-height-100); /* 1 */
```

Primitives at 48, 72, 96, 128 px are defined but have no semantic alias yet — they exist on the scale for future use without requiring a token addition.

### 2.6 Spacing

#### Primitives

Linear 4 px base, max 64 (`--space-16`):

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

#### Semantics (t-shirt)

T-shirt sizes covering every spacing value currently used in the codebase (after snaps). Components reference these; primitives are referenced only inside this file and via the positioning escape hatch.

```css
--space-2xs: var(--space-1);   /* 4 */
--space-xs:  var(--space-2);   /* 8 */
--space-sm:  var(--space-3);   /* 12 */
--space-md:  var(--space-4);   /* 16 */
--space-lg:  var(--space-5);   /* 20 */
--space-xl:  var(--space-6);   /* 24 */
--space-2xl: var(--space-7);   /* 28 */
--space-3xl: var(--space-8);   /* 32 */
--space-4xl: var(--space-10);  /* 40 */
--space-5xl: var(--space-11);  /* 44 */
--space-6xl: var(--space-12);  /* 48 */
--space-7xl: var(--space-16);  /* 64 */
```

Currently-unused primitives (`--space-9`, `--space-13`, `--space-14`, `--space-15`) are kept on the scale for completeness but have no semantic alias yet.

#### Escape hatch

`calc(var(--space-N) / 2)` allowed for **positioning only** (`top` / `left` / `transform`). Half-steps are 2, 6, 10, 14, 18, 22, 26, 30 px. Padding, margin, and gap must hit a semantic t-shirt token directly.

### 2.7 Radius

#### Primitives

```css
--radius-100: 4px;
--radius-200: 8px;
--radius-300: 12px;
```

#### Semantics

```css
--radius-sm:   var(--radius-100);  /* 4  — chips, small bullets */
--radius-md:   var(--radius-200);  /* 8  — buttons, toggles */
--radius-lg:   var(--radius-300);  /* 12 — surfaces, cards */
--radius-full: 9999px;             /* fully rounded — circles + pills */
```

**`--radius-full` consolidates the previous `50%` and `980px` usages.** Every current `border-radius: 50%` lives on a square element (StatusDot 8×8, TimelineMarker 8×8, LevelMeter dot 8×8, ContactCta avatar 44×44, ContactForm dots 13×13/7×7), so `9999px` produces an identical circle. For non-square elements (AvailabilityPill, CtaButton, send button), `9999px` produces the pill the current `980px` was approximating. One token covers both cases — no `--radius-pill`.

`--radius-full` has no primitive: it's the escape value for "as round as possible", not part of a graduated scale.

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

Snap rules from the issue: `11 → 12`, `13 → 14`, `15 → 16`, `19 → 20`, `28 → 30`, `38 → 36`, `58 → 60`.

| file:line                                          | current | snap to | semantic token  |
| -------------------------------------------------- | ------- | ------- | --------------- |
| `Experience/Experience.module.css:18`              | 15      | 16      | `--text-body-size`     |
| `Experience/Experience.module.css:73`              | 19      | 20      | `--text-subtitle-size` |
| `Experience/Experience.module.css:101`             | 15      | 16      | `--text-body-size`     |
| `KeySkills/KeySkills.module.css:48`                | 15      | 16      | `--text-body-size`     |
| `NotFound/NotFound.module.css:18`                  | 15      | 16      | `--text-body-size`     |
| `NotFound/NotFound.module.css:32`                  | 28      | 30      | `--text-title-size`    |
| `NotFound/NotFound.module.css:85`                  | 11      | 12      | `--text-caption-size`  |
| `NotFound/NotFound.module.css:94`                  | 13      | 14      | `--text-meta-size`     |
| `ContactForm/ContactForm.module.css:77`            | 13      | 14      | `--text-meta-size`     |
| `ContactForm/ContactForm.module.css:92`            | 15      | 16      | `--text-body-size`     |
| `ContactForm/ContactForm.module.css:162`           | 15      | 16      | `--text-body-size`     |
| `Accordion/Accordion.module.css:44`                | 15      | 16      | `--text-body-size`     |
| `OpenGraphCard/OpenGraphCard.module.css:28`        | 58      | 60      | `--text-display-size`  |
| `AvailabilityPill/AvailabilityPill.module.css:12`  | 15      | 16      | `--text-body-size`     |
| `AvailabilityPill/AvailabilityPill.module.css:25`  | 13      | 14      | `--text-meta-size`     |
| `Miscellaneous/Miscellaneous.module.css:17`        | 15      | 16      | `--text-body-size`     |
| `SkillGroups/SkillGroups.module.css:18`            | 15      | 16      | `--text-body-size`     |
| `ContactCta/ContactCta.module.css:125`             | 15      | 16      | `--text-body-size`     |
| `ContactCta/ContactCta.module.css:275`             | 15      | 16      | `--text-body-size`     |
| `Hero/Hero.astro:40`                               | 38      | 36      | `--text-hero-size`     |
| `Hero/Hero.astro:54`                               | 19      | 20      | `--text-subtitle-size` |
| `SkillRow/SkillRow.module.css:13`                  | 15      | 16      | `--text-body-size`     |
| `CtaButton/CtaButton.module.css:6`                 | 15      | 16      | `--text-body-size`     |

### 3.2 Line-height snaps

Off-scale line-heights snap to the nearest value on the `{1, 1.25, 1.375, 1.5, 1.625, 2}` scale. Each migrated declaration uses the semantic `--text-<role>-leading` for its role; outliers that don't match the role default fall back to the primitive `--line-height-N`.

| file:line                                  | current | snap to | replacement                                    |
| ------------------------------------------ | ------- | ------- | ---------------------------------------------- |
| `BaseLayout.astro:93`                      | 1.65    | 1.625   | `--text-body-leading`                          |
| `Experience/Experience.module.css:102`     | 1.6     | 1.625   | `--text-body-leading`                          |
| `NotFound/NotFound.module.css:33`          | 1.15    | 1.25    | `--text-title-leading`                         |
| `NotFound/NotFound.module.css:42`          | 1.6     | 1.625   | `--text-body-leading`                          |
| `NotFound/NotFound.module.css:95`          | 1.9     | 2       | `--line-height-600` (loose summary — outlier)  |
| `ContactForm/ContactForm.module.css:130`   | 1.6     | 1.625   | `--text-body-leading`                          |
| `Chip/Chip.module.css:4`                   | 1.5     | 1.5     | `--text-caption-leading` (no snap)             |
| `OpenGraphCard/OpenGraphCard.module.css:30`| 0.94    | 1       | `--text-display-leading`                       |
| `OpenGraphCard/OpenGraphCard.module.css:38`| 1.3     | 1.25    | `--line-height-200` (tighter than body — outlier) |
| `Hero/Hero.astro:41`                       | 1.12    | 1.25    | `--text-hero-leading` (visible drift +0.13)    |
| `Hero/Hero.astro:55`                       | 1.6     | 1.625   | `--text-subtitle-leading`                      |

Hero:41 has the largest drift (+0.13) — flagged for individual review.

### 3.3 Spacing snaps

Linear 4 px scale. Equidistant ties (e.g. 14 between 12 and 16) snap **up** by default to preserve visual breathing room.

| file:line                                          | current        | snap to        | semantic                          |
| -------------------------------------------------- | -------------- | -------------- | --------------------------------- |
| `Footer/Footer.module.css:24`                      | `gap: 6px`     | `gap: 8px`     | `--space-xs`                      |
| `NotFound/NotFound.module.css:59`                  | `gap: 9px`     | `gap: 8px`     | `--space-xs`                      |
| `NotFound/NotFound.module.css:60`                  | `padding: 11px 15px` | `padding: 12px 16px` | `--space-sm --space-md`     |
| `NotFound/NotFound.module.css:83`                  | `margin-left: 6px` | `margin-left: 8px` | `--space-xs`                  |
| `ContactForm/ContactForm.module.css:15`            | `gap: 9px`     | `gap: 8px`     | `--space-xs`                      |
| `ContactForm/ContactForm.module.css:16`            | `padding: 11px 15px` | `padding: 12px 16px` | `--space-sm --space-md`     |
| `ContactForm/ContactForm.module.css:46`            | `gap: 14px`    | `gap: 16px`    | `--space-md` (tie, rounds up)     |
| `ContactForm/ContactForm.module.css:47`            | `padding: 11px 16px` | `padding: 12px 16px` | `--space-sm --space-md`     |
| `ContactForm/ContactForm.module.css:56`            | `padding: 14px 16px` | `padding: 16px 16px` | `--space-md --space-md` (tie, up) |
| `ContactForm/ContactForm.module.css:72`            | `padding: 0 13px 0 11px` | `padding: 0 12px 0 12px` | `0 --space-sm 0 --space-sm` |
| `ContactForm/ContactForm.module.css:102`           | `padding: 11px 0` | `padding: 12px 0` | `--space-sm 0`                 |
| `ContactForm/ContactForm.module.css:138`           | `gap: 14px`    | `gap: 16px`    | `--space-md` (tie, rounds up)     |
| `ContactForm/ContactForm.module.css:153`           | `gap: 9px`     | `gap: 8px`     | `--space-xs`                      |
| `ContactForm/ContactForm.module.css:156`           | `padding: 0 22px` | `padding: 0 24px` | `0 --space-xl` (tie, up)       |
| `Miscellaneous/Miscellaneous.module.css:35`        | `padding-top: 18px` | `padding-top: 20px` | `--space-lg` (tie, up)        |
| `Miscellaneous/Miscellaneous.module.css:51`        | `gap: 10px`    | `gap: 12px`    | `--space-sm` (tie, up)            |
| `Miscellaneous/Miscellaneous.module.css:58`        | `gap: 9px`     | `gap: 8px`     | `--space-xs`                      |
| `Miscellaneous/Miscellaneous.module.css:59`        | `padding: 7px 13px` | `padding: 8px 12px` | `--space-xs --space-sm`       |
| `AvailabilityPill/AvailabilityPill.module.css:4`   | `gap: 10px`    | `gap: 12px`    | `--space-sm` (tie, up)            |
| `AvailabilityPill/AvailabilityPill.module.css:6`   | `padding: 0 18px` | `padding: 0 20px` | `0 --space-lg` (tie, up)       |
| `AvailabilityPill/AvailabilityPill.module.css:19`  | `gap: 6px`     | `gap: 8px`     | `--space-xs`                      |
| `OpenGraphCard/OpenGraphCard.module.css:9`         | `padding: 38px 40px` | `padding: 40px 40px` | `--space-4xl --space-4xl`     |
| `OpenGraphCard/OpenGraphCard.module.css:24`        | `gap: 14px`    | `gap: 16px`    | `--space-md` (tie, up)            |
| `OpenGraphCard/OpenGraphCard.module.css:45`        | `gap: 6px`     | `gap: 8px`     | `--space-xs`                      |
| `ContactCta/ContactCta.module.css:119`             | `padding: 0 22px` | `padding: 0 24px` | `0 --space-xl` (tie, up)       |

### 3.4 Radius snaps

| file:line                          | current | snap to | semantic         |
| ---------------------------------- | ------- | ------- | ---------------- |
| `Footer/Footer.module.css:29`      | 2px     | 4px     | `--radius-sm`    |

All `border-radius: 50%` declarations migrate to `--radius-full` (= 9999px) — visually identical on the square elements they target. All `border-radius: 980px` declarations migrate to the same `--radius-full`.

### 3.5 Positioning escape-hatch usages

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

Positioning values that escape both rules reference primitive `--space-N` directly (this is allowed because positioning is the only category where the escape hatch is permitted, and the half-step variant uses the same primitive).

### 3.6 Illustration-layer exceptions

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

### 3.7 Out of scope in this slice

- **`width` / `height` / `min-height` / `max-width`** literals (e.g. `width: 36px`, `min-height: 120px`, `max-width: 540px`). The issue scope is `font-size`, `padding`, `margin`, `gap`, `border-radius`, `top`, `left`, and `transform`. Width/height literals are flagged for a future slice — many are component-intrinsic sizes that may or may not benefit from tokenisation.
- **Component folder reorganisation.** All CSS Modules stay at `src/components/<Name>/<Name>.module.css`. The folder mapping below is informational for the next slice.

### 3.8 Reported as bug candidates (no fix in this slice)

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
- [ ] Approve every line-height snap in §3.2 (Hero:41 has the largest drift at +0.13).
- [ ] Approve every spacing snap in §3.3 (or veto — equidistant ties round up by default; flag any where rounding down is preferred).
- [ ] Approve the single radius snap in §3.4 and the `50%` + `980px` → `--radius-full` consolidation.
- [ ] Approve the four token renames in §2.4.
- [ ] Approve the color primitive palette in §2.2 (especially the charcoal 600/650 split) and the `color-mix` usage in §2.3.
- [ ] Approve the typography semantic naming (`--text-<role>-size` / `-leading`) in §2.5.
- [ ] Approve the spacing t-shirt scale in §2.6 (12 sizes covering current usage).
- [ ] Approve the radius primitive + semantic split in §2.7.
- [ ] Approve the illustration-layer exceptions in §3.6.

After approval, subsequent commits on this branch implement the migration in this order:

1. Rewrite `src/styles/tokens.css` with primitive + semantic layers (no component changes).
2. Apply the four renames across every consuming CSS Module.
3. Apply approved snaps + token references in component CSS, one component or small group per commit.
4. Update `AGENTS.md` per §5.
5. Run gates (`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:bundle`, `pnpm test:e2e`) and request manual verification on `index.astro` + `404.astro`.
