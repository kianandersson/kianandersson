# Kian Andersson

Source for [kianandersson.dk](https://kianandersson.dk).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Develop

Requires Node ≥20, pnpm 11, Wrangler's runtime types, and Playwright's Chromium.

```sh
pnpm install
pnpm exec wrangler types
pnpm exec playwright install --with-deps chromium
pnpm dev
```

## Contact form

Submissions are handled by an Astro Action (`src/actions/index.ts`) running on
the Cloudflare Worker, which dispatches email via [Resend](https://resend.com).

Two environment variables, configured as Wrangler secrets in production and in
`.dev.vars` locally (see `.dev.vars.example`):

- `RESEND_API_KEY` — required in production. When absent, the action logs the
  payload and returns success, so `pnpm dev` works without a key.
- `CONTACT_TO` — destination inbox. Defaults to `siteConfig.email`.

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
