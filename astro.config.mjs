// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Where this build is being deployed to. Drives canonical URLs, the
// sitemap, og:image, JSON-LD and robots.txt. Set per environment from
// CI; falls back to the local dev server URL so `pnpm build && pnpm
// preview` on a developer machine produces self-consistent links.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [preact({ compat: true }), sitemap()],
});
