// @ts-check
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kianandersson.dk',
  output: 'static',
  integrations: [preact({ compat: true })],
});
