# Kian Andersson

Source for [kianandersson.com](https://kianandersson.com).

Design system at [kianandersson.com/design](https://kianandersson.com/design).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

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
- `EXCLUDE_STORYBOOK` — when set, `pnpm build` skips the Storybook catalog.
- `BUILD_OUT_DIR` — overrides the build output directory.

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

`pnpm print` renders the page to `cv.pdf` locally, adding the private contact
details (email, phone) the public site omits.

```sh
pnpm print --email me@example.com --phone "+45 12 34 56 78"
pnpm print            # uses a git-ignored print.options.json if present
```

## License

This project is licensed under the [MIT License](./LICENSE).
