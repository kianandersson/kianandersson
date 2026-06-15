// @ts-check
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, sessionDrivers } from 'astro/config';
import { ogImage } from './src/integrations/og-image.ts';

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
});
