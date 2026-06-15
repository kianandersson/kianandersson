# Naming conventions for the design system

A shared ruleset for naming components, tokens, files, and icons. Examples follow React conventions. The goal is consistency: anyone on the team should be able to guess a name without looking it up.

---

## 0. Core principles

Three rules that override everything else:

1. **Name by role, not appearance.** A name should describe what something _is_ or _does_ — not how it looks. `Button`, not `BlueRoundedBox`. `danger`, not `red`. Appearance changes; the role does not.
2. **A variant is a prop, not a new component.** If two things share anatomy and behavior, the difference is a `variant`/`size`/`tone` prop — not `PrimaryButton` and `SecondaryButton`.
3. **Be predictable over clever.** The boring, guessable name always beats the cleverly abbreviated one. Better long and clear than short and cryptic.

---

## 1. Components

### Casing

- **Component names:** `PascalCase` — `Card`, `DropdownMenu`, `DatePicker`.
- **Component file names:** match the component name — `Card.tsx`, `DropdownMenu.tsx`.

### The name describes the role

Use a noun for what the component _is_. Don't bake appearance, color, or context into the name.

| Good     | Bad               | Why                      |
| -------- | ----------------- | ------------------------ |
| `Button` | `BlueButton`      | Color is a variant       |
| `Alert`  | `RedBox`          | Describe the role        |
| `Modal`  | `PopupThing`      | Use the established term |
| `Avatar` | `UserCircleImage` | Too specific             |

### Compound components (subcomponents)

When a component has fixed children, use a **parent prefix** so the hierarchy is visible in the name and in auto-complete:

```
Card
├── CardHeader
├── CardBody
└── CardFooter
```

### Boolean prefixes

States are named with a verb/adjective prefix so they read as yes/no:

- `is…` for state: `isOpen`, `isDisabled`, `isLoading`
- `has…` for presence: `hasIcon`, `hasError`
- `can…` for permission: `canDismiss`

### Event handlers

- Prop that receives the handler: `on` + event — `onClick`, `onChange`, `onSelect`, `onDismiss`.
- Internal function that handles it: `handle` + event — `handleClick`, `handleSubmit`.

---

## 2. Variants, sizes, and props

### Standardized prop names

Use the same prop names across _all_ components. Consistency here is what makes the system feel like one thing.

| Prop      | Values (example)                             | Used for         |
| --------- | -------------------------------------------- | ---------------- |
| `variant` | `solid` · `outline` · `ghost`                | Visual style     |
| `size`    | `sm` · `md` · `lg`                           | Size             |
| `tone`    | `neutral` · `success` · `warning` · `danger` | Semantic meaning |
| `align`   | `start` · `center` · `end`                   | Alignment        |

### Semantic, not literal values

Values should describe _meaning_ so they survive a re-styling:

- ✅ `tone="danger"`, `tone="success"`
- ❌ `color="red"`, `color="green"`

### Sizes

Stick to a small, fixed scale: `sm` · `md` · `lg` (extend with `xs`/`xl` only when genuinely needed). Use `md` as the default — avoid naming the default `default`; just set it as the default value.

---

## 3. Design tokens

Tokens are named in **tiers** from abstract to concrete. A well-known pattern (Nathan Curtis / W3C style) is:

```
[category]-[concept]-[variant]-[state]
```

### Two layers: primitive → semantic

Separate the raw values from their meaning. This is the single most important move in token naming.

**Primitive (raw values — rarely referenced directly):**

```
color-blue-500
color-gray-900
space-4
radius-md
font-size-200
```

**Semantic (point to a primitive, used in components):**

```
color-text-default        →  color-gray-900
color-bg-danger           →  color-red-500
color-border-subtle       →  color-gray-200
space-inset-md            →  space-4
radius-interactive        →  radius-md
```

Components reference **only** semantic tokens. That way you can re-theme by moving a single semantic token, without touching the components.

### Conventions

- Use `kebab-case` consistently: `color-bg-danger`, `space-inset-md`.
- Numeric scales run from light/small to dark/large: `50 → 900` for colors, `0 → 96` for spacing.
- Spacing follows a linear 4px base unit (`space-1` = 4px, number × 4 = px).
- Radius is a small semantic scale: `radius-sm` · `radius-md` · `radius-lg` · `radius-full`.

---

## 4. Files and folders

### Structure

One folder per component, with everything that belongs to it kept together:

```
src/components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   ├── Button.module.css
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── CardHeader.tsx
│   ├── CardBody.tsx
│   └── index.ts
```

### Rules

- **Component folders and files:** `PascalCase` — match the component name.
- **Non-component files** (utils, hooks, config): `camelCase` — `useToggle.ts`, `formatDate.ts`, `tokens.ts`.
- **Hooks** always start with `use`: `useDisclosure`, `useMediaQuery`.
- **index.ts** re-exports the folder's public API so imports stay clean: `import { Button } from '@/components/Button'`.
- **One folder = one responsibility.** Don't mix unrelated components in the same folder.

---

## 5. Icons

### Naming

- **File name:** `kebab-case`, describing the _motif_, not the usage — `arrow-right.svg`, `chevron-down.svg`, `trash.svg`.
- **Component (if SVGs are wrapped in React):** `PascalCase` with an `Icon` suffix — `ArrowRightIcon`, `ChevronDownIcon`.

### Describe the motif, not the function

An icon can be used in several places; name it by what it shows:

- ✅ `trash.svg` (motif)
- ❌ `delete-button-icon.svg` (function + context)

### Consistent pairs and directions

- Direction as a suffix: `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right`.
- Filled vs. outline as a suffix when both exist: `heart-outline`, `heart-fill`.
- Keep size out of the name — it's a prop (`<Icon size="md" />`), not `arrow-16.svg`.

---

## 6. Quick checklist

Before naming anything new, ask these questions:

- Does the name describe the **role**, not the appearance?
- Can a colleague **guess** the name without looking it up?
- Is this a **new component**, or just a **variant** of an existing one?
- Am I using the **same prop names** (`variant`, `size`, `tone`) as the rest of the system?
- Does the component reference only **semantic tokens**, not primitives?
- Does the casing follow the rule for its type (`PascalCase` component, `camelCase` util, `kebab-case` icon/token)?
