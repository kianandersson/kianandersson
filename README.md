# Kian Andersson

Source for [kianandersson.dk](https://kianandersson.dk).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Develop

Requires Node ≥20, pnpm 11, and Playwright's Chromium.

```sh
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm dev
```

## Contact form

Submissions are handled by an Astro Action (`src/actions/index.ts`) running on
the Cloudflare Worker, which dispatches email via [Resend](https://resend.com).

Three environment variables, configured as Wrangler secrets in production and
in `.env` locally (see `.env.example`). All three are required; if any are
missing the action returns an error.

- `RESEND_API_KEY` — Resend API key.
- `CONTACT_FROM` — verified sender address, e.g. `noreply@example.com`.
- `CONTACT_TO` — destination inbox.

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
