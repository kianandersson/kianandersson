import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from '@playwright/test';
import type { AstroIntegration } from 'astro';
import { OG_IMAGE_SIZE } from '../lib/og';

const CANVAS = OG_IMAGE_SIZE;
const OUTPUT_FILE = 'og.png';

// Fake origin for build-time rendering: every request is intercepted and
// answered from disk, so this host never actually hits the network.
const INTERNAL_ORIGIN = 'http://og.local';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

/**
 * Answers the browser's requests straight from the finished build on disk, so
 * absolute asset paths (`/_astro/*.css`, `/fonts/*.woff2`) resolve exactly as
 * they would in production — no dev server required.
 */
async function serveBuildDir(page: Page, dir: string): Promise<void> {
  await page.route('**/*', async (route) => {
    let pathname = new URL(route.request().url()).pathname;
    if (pathname.endsWith('/')) pathname += 'index.html';
    try {
      const body = await readFile(join(dir, pathname));
      const contentType = MIME_TYPES[extname(pathname)] ?? 'application/octet-stream';
      await route.fulfill({ body, contentType });
    } catch {
      await route.fulfill({ status: 404 });
    }
  });
}

/** Loads the `/og` page, waits for fonts, and snapshots the 1200×630 canvas. */
async function captureOg(page: Page, url: string): Promise<Buffer> {
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot({ type: 'png', clip: { x: 0, y: 0, ...CANVAS } });
}

async function withBrowser<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: CANVAS });
    return await fn(page);
  } finally {
    await browser.close();
  }
}

/**
 * Renders the Open Graph image by screenshotting the `/og` page.
 *
 * `/og` is a normal Astro page that ships as-is, so its full styling — tokens,
 * component CSS, and anything child components pull in — is bundled by Astro.
 * At build time we screenshot the built page from disk into `/og.png`; in dev
 * we render it on demand so the same URL resolves while you work.
 */
export function ogImage(): AstroIntegration {
  return {
    name: 'og-image',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const png = await withBrowser(async (page) => {
          await serveBuildDir(page, outDir);
          return captureOg(page, `${INTERNAL_ORIGIN}/og/`);
        });
        await writeFile(join(outDir, OUTPUT_FILE), png);
        logger.info(`Wrote ${OUTPUT_FILE}`);
      },

      'astro:server:setup': ({ server, logger }) => {
        server.middlewares.use(`/${OUTPUT_FILE}`, async (req, res) => {
          try {
            const host = req.headers.host ?? 'localhost';
            const png = await withBrowser((page) => captureOg(page, `http://${host}/og`));
            res.setHeader('content-type', 'image/png');
            res.end(png);
          } catch (error) {
            logger.error(`Failed to render /${OUTPUT_FILE}: ${error}`);
            res.statusCode = 500;
            res.end();
          }
        });
      },
    },
  };
}
