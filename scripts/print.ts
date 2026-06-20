#!/usr/bin/env node
/**
 * Renders the front page to a PDF — locally only.
 *
 * The public site deliberately omits the private contact details (email and
 * phone). This script collects those from CLI options (and/or an options file),
 * builds the site *with* them into a throwaway temp directory, previews it,
 * prints it to PDF via Playwright, then deletes the build so nothing private is
 * left behind. The details never touch .env or the public deploy. Everything
 * else on the page footer comes from the site config.
 *
 * Usage:
 *   pnpm print --email me@example.com --phone "+45 12 34 56 78"
 *   pnpm print --options ./my-details.json
 *   pnpm print            # uses print.options.json if present
 *
 * Options: --email --phone
 *          --options <file>  JSON with email/phone (CLI flags win)
 *          --output <file>   PDF path (default cv.pdf)
 */
import { readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { build, preview } from 'astro';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTACT_FIELDS = ['email', 'phone'] as const;
const DEFAULT_OPTIONS_FILE = join(ROOT, 'print.options.json');

type ContactField = (typeof CONTACT_FIELDS)[number];
type Contact = Partial<Record<ContactField, string>>;

// Build inside the project root (not the OS temp dir): the Cloudflare adapter
// derives a relative .dev.vars path during prerender, and a path outside the
// repo breaks the workerd runtime it spins up.
const BUILD_DIR = join(ROOT, '.print');

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      email: { type: 'string' },
      phone: { type: 'string' },
      options: { type: 'string', short: 'o' },
      output: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    printUsage();
    return;
  }

  const contact = collectContact(values);
  if (Object.keys(contact).length === 0) {
    console.error('No contact details provided.\n');
    printUsage();
    process.exit(1);
  }

  const outputPdf = values.output ? resolve(values.output) : join(ROOT, 'cv.pdf');

  // The private details are inlined at build time via a Vite define that reads
  // PRINT_OPTIONS (see astro.config.mjs); Storybook is skipped for speed.
  process.env.PRINT_OPTIONS = JSON.stringify(contact);
  process.env.EXCLUDE_STORYBOOK = '1';

  try {
    console.log('→ Building site with contact details');
    await build({ root: ROOT, outDir: BUILD_DIR, logLevel: 'error' });

    const port = await freePort();
    const server = await preview({
      root: ROOT,
      outDir: BUILD_DIR,
      logLevel: 'error',
      server: { port },
    });
    try {
      console.log('→ Rendering PDF');
      await renderPdf(`http://localhost:${port}/`, outputPdf);
      console.log(`✓ Wrote ${outputPdf}`);
    } finally {
      await server.stop();
    }
  } finally {
    await rm(BUILD_DIR, { recursive: true, force: true });
    console.log('✓ Removed temporary build');
  }
}

/**
 * Merges contact details from an options file (explicit --options, else
 * print.options.json if present) with CLI flags, where CLI flags win. Blank
 * values are dropped so empty placeholders don't surface on the CV.
 */
function collectContact(values: { email?: string; phone?: string; options?: string }): Contact {
  const fromFile = readOptionsFile(values.options);
  const merged: Contact = {};
  for (const field of CONTACT_FIELDS) {
    const value = values[field] ?? fromFile[field];
    if (typeof value === 'string' && value.trim() !== '') {
      merged[field] = value.trim();
    }
  }
  return merged;
}

function readOptionsFile(explicitPath?: string): Record<string, unknown> {
  const path = explicitPath ? resolve(explicitPath) : DEFAULT_OPTIONS_FILE;
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    // A missing default file is fine; a missing explicit one is an error.
    if (explicitPath) throw new Error(`Options file not found: ${path}`);
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new Error(`Options file is not valid JSON: ${path}`, { cause });
  }
}

function printUsage(): void {
  console.log(
    `Render the front page to a PDF CV (local only).\n\n` +
      `The private details (email, phone) are added here; everything else on\n` +
      `the footer comes from the site config.\n\n` +
      `Usage:\n` +
      `  pnpm print --email me@example.com --phone "+45 12 34 56 78"\n` +
      `  pnpm print --options ./my-details.json\n` +
      `  pnpm print            # uses print.options.json if present\n\n` +
      `Private options: ${CONTACT_FIELDS.map((f) => `--${f}`).join(' ')}\n` +
      `  --options, -o <file>   JSON file with email/phone (CLI flags win)\n` +
      `  --output <file>        PDF output path (default cv.pdf)\n`,
  );
}

async function renderPdf(origin: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      // Honour the @page margins declared in the site's CSS.
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}

/** Grab an available port so the preview server never clashes with a dev run. */
function freePort(): Promise<number> {
  return new Promise((resolvePromise, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address() as AddressInfo;
      probe.close(() => resolvePromise(port));
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
