// @ts-check
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, sessionDrivers } from 'astro/config';
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
    optimizeDeps: {
      // Workaround for astro/issues/16248: deps that aren't reachable by the
      // SSR scanner end up discovered at runtime, triggering rebundles that
      // reload mid-render — the first request paints an empty page. The
      // adapter merges this list into its own SSR include.
      include: [
        '@astrojs/preact/server.js',
        'astro/actions/runtime/entrypoints/server.js',
        'astro/zod',
        'preact/devtools',
        'resend',
      ],
    },
    plugins: [
      {
        // Top-level `optimizeDeps.force` doesn't reach the SSR environment —
        // the adapter rebuilds the SSR optimizeDeps object without it. Inject
        // `force: true` per-environment so restarts bundle fresh; the cached
        // path triggers a spurious rebundle that loses the chunk-rename race.
        name: 'force-ssr-prebundle',
        configEnvironment(name) {
          if (name === 'client') return;
          return { optimizeDeps: { force: true } };
        },
      },
    ],
  },
});
