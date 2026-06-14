# kianandersson.com

Source for [kianandersson.dk](https://kianandersson.dk).

Built with [Astro](https://astro.build), [Preact](https://preactjs.com) (islands only), and [Biome](https://biomejs.dev). Hosted on Cloudflare Pages.

## Develop

```sh
pnpm install
pnpm dev
```

## Common commands

```sh
pnpm build              # production build
pnpm test               # vitest (unit + island)
pnpm test:e2e           # playwright + axe
pnpm lint               # biome
pnpm typecheck          # astro check
pnpm lhci               # lighthouse CI
pnpm check:bundle       # gzipped JS budget
```

## Environment

`PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` — Cloudflare Web Analytics beacon token. The beacon is only emitted when this is set.

## License

[MIT](./LICENSE).
