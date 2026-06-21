# Kian Andersson

Source for [kianandersson.com](https://kianandersson.com).

Design system at [kianandersson.com/design](https://kianandersson.com/design).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Develop

Requires Node ≥22.18, pnpm 11, and Playwright's Chromium.

```sh
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm dev
```

## Environment

See `.env.example` for local development.

- `RESEND_API_KEY` — Resend API key.
- `SENDER_EMAIL` — verified sender address.
- `RECIPIENT_EMAIL` — destination inbox.
- `EXCLUDE_STORYBOOK` — exclude design catalog from build

## Common commands

```sh
pnpm build              # production build
pnpm check              # typecheck + lint + tests (fast gates)
pnpm typecheck          # astro check
pnpm lint               # biome
pnpm test               # vitest
pnpm test:bundle        # gzipped JS budget
pnpm test:e2e           # playwright + axe
pnpm test:lighthouse    # lighthouse CI
pnpm print              # render the front page to cv.pdf (runs locally)
```

## Print to PDF

Run `pnpm print` to render the page to a PDF locally.

```sh
pnpm print --email me@example.com --phone "+45 12 34 56 78"
pnpm print --email me@example.com --min-skill-level 3  # drop level 1–2 skills
pnpm print            # uses print.options.json if present
```

`--min-skill-level <1-5>` sets the lowest skill level kept in the "all skills"
section (default: every skill). Curated key skills are unaffected.

## License

This project is licensed under the [MIT License](./LICENSE).
