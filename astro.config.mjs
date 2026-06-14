// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// CI sets URL per environment; the localhost fallback keeps
// `pnpm build && pnpm preview` self-consistent on a dev machine.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [preact({ compat: true }), sitemap()],
});
