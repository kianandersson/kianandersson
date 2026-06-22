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
pnpm check              # typecheck + lint + tests
pnpm typecheck          # astro check
pnpm lint               # biome
pnpm test               # vitest
pnpm test:bundle        # gzipped js budget
pnpm test:e2e           # playwright + axe
pnpm test:lighthouse    # lighthouse ci
pnpm print              # build the cv as pdf
pnpm signature          # build the e-mail signature
```

## Print to PDF

Run `pnpm print` to render the page to a PDF.

```sh
pnpm print --email me@example.com --phone "+45 12 34 56 78"
pnpm print            # uses print.options.json if present
```

## E-mail signature

Run `pnpm signature` to build the HTML signature,

```sh
pnpm signature --email me@example.com --phone "+45 12 34 56 78"
pnpm signature            # uses print.options.json if present
```

## License

This project is licensed under the [MIT License](./LICENSE).
