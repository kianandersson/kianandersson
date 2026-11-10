// @ts-check
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, sessionDrivers } from 'astro/config';
import { favicons } from './src/integrations/favicons.ts';
import { ogImage } from './src/integrations/og-image.ts';
import { storybook } from './src/integrations/storybook.ts';

const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  adapter: cloudflare(),
  // Astro 6 has no `session: false` switch. The Cloudflare adapter's
  // default driver is KV, which adds a SESSION binding wrangler then tries
  // to provision at deploy time. We don't use sessions — route them to an
  // in-memory driver so the binding stays out of the generated config.
  session: {
    driver: sessionDrivers.lruCache(),
  },
  integrations: [
    preact({ compat: true }),
    // `/og` is a render-only canvas for the OG image, not a real page.
    sitemap({ filter: (page) => !page.endsWith('/og/') }),
    ogImage(),
    favicons(),
    storybook(),
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SENDER_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      RECIPIENT_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  vite: {
    // Private contact details for the print build, injected at build time by
    // scripts/print.ts. Inlined here (rather than via astro:env) so the
    // value survives into the Cloudflare adapter's workerd prerender, and is
    // simply '' on the public build — so nothing private ever ships.
    define: {
      __PRINT_OPTIONS__: JSON.stringify(process.env.PRINT_OPTIONS ?? ''),
    },
    // The adapter merges these into the SSR (workerd) deps optimizer.
    optimizeDeps: {
      // Injected by @astrojs/preact in dev only, so the scanner misses it. Found
      // mid-request, it triggers a re-bundle that reloads workerd and breaks
      // the first render.
      include: ['preact/devtools'],
      // Astro scans every src/**/*.ts for server deps, which reaches the
      // build-time integrations in src/integrations/. Bundling these
      // Node-only deps fails (fsevents.node), so dev never starts.
      exclude: ['@playwright/test', 'sharp'],
    },
  },
});
