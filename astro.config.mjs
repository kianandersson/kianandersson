// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { ogImage } from './src/integrations/og-image.ts';

// CI sets URL per environment; the localhost fallback keeps
// `pnpm build && pnpm preview` self-consistent on a dev machine.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    preact({ compat: true }),
    // `/og` is a render-only canvas for the OG image, not a real page.
    sitemap({ filter: (page) => !page.endsWith('/og/') }),
    ogImage(),
  ],
});
