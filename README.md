# kianandersson.com

Source for [kianandersson.dk](https://kianandersson.dk).

Built with [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Develop

Requires Node ≥20 and pnpm 11.

```sh
pnpm install
pnpm dev
```

Building or running e2e tests also needs Playwright's Chromium:

```sh
pnpm exec playwright install --with-deps chromium
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
