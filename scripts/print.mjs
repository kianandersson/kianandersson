#!/usr/bin/env node
/**
 * Renders the front page to a PDF — locally only.
 *
 * The public site deliberately omits the private contact details (email and
 * phone). This script collects those from CLI options (and/or an options file),
 * builds the site *with* them into a throwaway temp directory, serves the static
 * client output, prints it to PDF via Playwright, then deletes the build so
 * nothing private is left behind. The details never touch .env or the public
 * deploy. Everything else on the page footer comes from the site config.
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
import { spawn } from 'node:child_process';
import { createReadStream, readFileSync } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import http from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTACT_FIELDS = ['email', 'phone'];
const DEFAULT_OPTIONS_FILE = join(ROOT, 'print.options.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

async function main() {
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

  // Build inside the project root (not the OS temp dir): the Cloudflare adapter
  // derives a relative .dev.vars path during prerender, and a path outside the
  // repo breaks the workerd runtime it spins up.
  const buildDir = await mkdtemp(join(ROOT, '.print-'));
  try {
    console.log(`→ Building site with contact details (${buildDir})`);
    await build(buildDir, JSON.stringify(contact));

    const { server, origin } = await serve(join(buildDir, 'client'));
    try {
      console.log('→ Rendering PDF');
      await renderPdf(origin, outputPdf);
      console.log(`✓ Wrote ${outputPdf}`);
    } finally {
      server.close();
    }
  } finally {
    await rm(buildDir, { recursive: true, force: true });
    console.log('✓ Removed temporary build');
  }
}

/**
 * Merges contact details from an options file (explicit --options, else
 * print.options.json if present) with CLI flags, where CLI flags win. Blank
 * values are dropped so empty placeholders don't surface on the CV.
 */
function collectContact(values) {
  const fromFile = readOptionsFile(values.options);
  const merged = {};
  for (const field of CONTACT_FIELDS) {
    const value = values[field] ?? fromFile[field];
    if (typeof value === 'string' && value.trim() !== '') {
      merged[field] = value.trim();
    }
  }
  return merged;
}

function readOptionsFile(explicitPath) {
  const path = explicitPath ? resolve(explicitPath) : DEFAULT_OPTIONS_FILE;
  let raw;
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

function printUsage() {
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

function build(outDir, printOptions) {
  return run('pnpm', ['exec', 'astro', 'build'], {
    ...process.env,
    PRINT_OPTIONS: printOptions,
    BUILD_OUT_DIR: outDir,
    EXCLUDE_STORYBOOK: '1',
  });
}

function serve(root) {
  const base = resolve(root);
  const server = http.createServer((req, res) => {
    handle(base, req, res).catch(() => {
      if (!res.headersSent) res.writeHead(500);
      res.end('Server error');
    });
  });

  return new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
      resolvePromise({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

async function handle(base, req, res) {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let filePath = normalize(join(base, urlPath));

  // Refuse to serve anything outside the build directory.
  if (filePath !== base && !filePath.startsWith(base + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let info = await stat(filePath).catch(() => null);
  if (info?.isDirectory()) {
    filePath = join(filePath, 'index.html');
    info = await stat(filePath).catch(() => null);
  }
  if (!info?.isFile()) {
    res.writeHead(404).end('Not found');
    return;
  }

  res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}

async function renderPdf(origin, outputPath) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
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

function run(command, args, env) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd: ROOT, env });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
