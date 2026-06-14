// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Where this build is being deployed to. Drives canonical URLs, the
// sitemap, og:image, JSON-LD and robots.txt. Set per environment from
// CI; falls back to the production domain for local builds.
const site = process.env.SITE_URL ?? 'https://kianandersson.dk';

export default defineConfig({
  site,
  output: 'static',
  integrations: [preact({ compat: true }), sitemap()],
});
