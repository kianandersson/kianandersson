// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kianandersson.dk',
  output: 'static',
  integrations: [preact({ compat: true }), sitemap()],
});
