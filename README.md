# Kian Andersson

Source for [kianandersson.dk](https://kianandersson.dk).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Design system

Storybook ships alongside the site at [kianandersson.dk/design](https://kianandersson.dk/design) on every deploy (and on each PR preview). Run `pnpm storybook` for a local instance.

## Develop

Requires Node ≥20, pnpm 11, and Playwright's Chromium.

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
```

## License

This project is licensed under the [MIT License](./LICENSE).
