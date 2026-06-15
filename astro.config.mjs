// @ts-check
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, sessionDrivers } from 'astro/config';
import { ogImage } from './src/integrations/og-image.ts';

// CI sets URL per environment; the localhost fallback keeps
// `pnpm build && pnpm preview` self-consistent on a dev machine.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  adapter: cloudflare(),
  // We don't use Astro sessions; point at an in-memory driver so the
  // Cloudflare adapter doesn't add a SESSION KV binding that wrangler
  // then tries to provision at deploy time.
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
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
