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

## Common commands

```sh
pnpm build              # production build
pnpm test               # vitest (unit + island)
pnpm test:e2e           # playwright + axe
pnpm lint               # biome
pnpm typecheck          # astro check
pnpm test:lighthouse    # lighthouse CI
pnpm test:bundle        # gzipped JS budget
```

## License

[MIT](./LICENSE).
