#!/usr/bin/env node
/**
 * Renders the EmailSignature component to HTML and copies it to the clipboard
 * (macOS), ready to paste straight into Mail / Outlook / Gmail.
 *
 * The markup lives in the design system as `<EmailSignature>` (cataloged in
 * Storybook). This script is the thin CLI around it: it resolves the design
 * tokens to concrete values, renders the component with them, and handles the
 * private details and clipboard.
 *
 * Why resolve tokens here: e-mail clients support no CSS variables, stylesheets,
 * or web fonts, so the component takes flat style values as props. Storybook
 * feeds it live `var(--token)` references; here each token is resolved from
 * `src/styles/tokens.css` to a concrete value (sRGB hex for colours) in a
 * headless Chromium — exactly as the browser renders it — so the signature
 * survives in every client. Change a token and the signature follows.
 *
 * Public identity (name, role, website) comes from `src/site.config.ts`. The
 * private details (email, phone) are deliberately kept out of source — pass them
 * as options, same as `pnpm print`.
 *
 * The logo ships in two clipboard steps. Many clients strip an inline image, so
 * the signature is copied without one; then the real PNG is copied as an image
 * to paste in below the divider, where it embeds as a `cid:` attachment every
 * client renders.
 *
 * Usage:
 *   pnpm signature --email me@example.com --phone "+45 12 34 56 78"
 *   pnpm signature --options ./my-details.json
 *   pnpm signature --email me@example.com --output signature.html
 *   pnpm signature --email me@example.com --stdout
 *
 * Options: --email --phone
 *          --options, -o <file>  JSON with email/phone (CLI flags win)
 *          --output <file>       Also write the signature HTML to a file
 *          --stdout              Print the signature HTML to stdout
 *          --no-clipboard        Skip copying to the clipboard
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { transform } from 'esbuild';
import { type ComponentType, h } from 'preact';
import { render } from 'preact-render-to-string';
import sharp from 'sharp';
import type {
  EmailSignatureProps,
  SignatureTokenManifest,
  SignatureTokens,
} from '../src/artifacts/EmailSignature/EmailSignature';
// Runtime import (unlike the type-only import above), so it needs the explicit
// .ts extension: Node's ESM resolver does no extension guessing, and this script
// runs straight through `node`.
import { resolveSignatureTokens } from '../src/artifacts/EmailSignature/resolveTokens.ts';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TOKENS_CSS = join(ROOT, 'src/styles/tokens.css');
const SITE_CONFIG = join(ROOT, 'src/site.config.ts');
const COMPONENT = join(ROOT, 'src/artifacts/EmailSignature/EmailSignature.tsx');
const LOGO_SVG = join(ROOT, 'assets/icon-rounded.svg');
const DEFAULT_OPTIONS_FILE = join(ROOT, 'print.options.json');

const CONTACT_FIELDS = ['email', 'phone'] as const;
type ContactField = (typeof CONTACT_FIELDS)[number];
type Contact = Partial<Record<ContactField, string>>;

type Identity = { fullName: string; role: string; website: string };

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      email: { type: 'string' },
      phone: { type: 'string' },
      options: { type: 'string', short: 'o' },
      output: { type: 'string' },
      stdout: { type: 'boolean' },
      'no-clipboard': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    printUsage();
    return;
  }

  const contact = collectContact(values);
  if (!contact.email) {
    console.error('No email provided.\n');
    printUsage();
    process.exit(1);
  }

  const identity = readIdentity();
  const { EmailSignature, SIGNATURE_TOKENS } = await loadComponentModule();
  const tokens = await resolveTokens(SIGNATURE_TOKENS);
  const logoPng = await renderLogo(Number.parseFloat(tokens['--space-4xl']));
  // The signature is rendered without the logo; the raster is delivered on the
  // clipboard separately, to be pasted in below the divider as an attachment.
  const html = renderSignature(EmailSignature, identity, contact, tokens);

  if (values.output) {
    const outputPath = resolve(values.output);
    writeFileSync(outputPath, `${html}\n`, 'utf8');
    console.log(`✓ Wrote ${outputPath}`);
  }
  if (values.stdout) {
    console.log(html);
  }
  if (!values['no-clipboard']) {
    copyHtmlToClipboard(html);
    await copyLogoStep(logoPng);
  }
}

/**
 * Merges contact details from an options file (explicit --options, else
 * print.options.json if present) with CLI flags, where CLI flags win. Blank
 * values are dropped so empty placeholders never surface in the signature.
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

/**
 * Reads the public identity from site.config.ts by source rather than import:
 * the config uses extensionless imports that Vite resolves but plain Node does
 * not.
 */
function readIdentity(): Identity {
  const src = readFileSync(SITE_CONFIG, 'utf8');
  const pick = (key: string): string => {
    const match = src.match(new RegExp(`${key}:\\s*'([^']*)'`));
    if (!match) throw new Error(`Could not read ${key} from site.config.ts`);
    return match[1];
  };
  return {
    fullName: `${pick('firstName')} ${pick('lastName')}`,
    role: pick('role'),
    website: pick('website'),
  };
}

/**
 * Loads tokens.css into a headless Chromium and resolves each token to its flat
 * value with the browser's own engine. This launches the real renderer rather
 * than re-deriving the colour maths (oklch → sRGB gamut mapping) ourselves, so
 * the signature gets exactly the sRGB the site ships — no second, drifting
 * conversion. Storybook runs the same `resolveSignatureTokens` in its own
 * browser, so the preview and the e-mail resolve identically.
 */
async function resolveTokens(manifest: SignatureTokenManifest): Promise<SignatureTokens> {
  const css = readFileSync(TOKENS_CSS, 'utf8');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head><body></body></html>`,
    );
    return (await page.evaluate(resolveSignatureTokens, manifest)) as SignatureTokens;
  } finally {
    await browser.close();
  }
}

/**
 * Loads the EmailSignature module in Node. The component is a leaf .tsx, so it's
 * transpiled in place (esbuild) into a temp ESM module next to the project root
 * — where its bare `preact/jsx-runtime` import resolves — then imported. This
 * also gives the token manifest the component and the CLI share.
 */
async function loadComponentModule(): Promise<{
  EmailSignature: ComponentType<EmailSignatureProps>;
  SIGNATURE_TOKENS: SignatureTokenManifest;
}> {
  const { code } = await transform(readFileSync(COMPONENT, 'utf8'), {
    loader: 'tsx',
    jsx: 'automatic',
    jsxImportSource: 'preact',
    format: 'esm',
  });
  const tmp = join(ROOT, `.email-signature.${process.pid}.mjs`);
  writeFileSync(tmp, code);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    rmSync(tmp, { force: true });
  }
}

/**
 * Rasterises the brand icon tile to a PNG for the clipboard. SVG isn't rendered
 * by e-mail clients, and an inline image is stripped by many of them, so the
 * tile never goes into the markup — it's copied as an image and pasted in below
 * the divider, where it embeds as a `cid:` attachment every client renders.
 *
 * Full retina resolution at the right display size: the raster is 2× the display
 * height in pixels but tagged at 144 DPI (2×72). A pasted image has no width
 * attribute to scale it, so the mail editor sizes it by its DPI — Apple Mail
 * places an 80px @ 144 DPI tile at 40 pt, sharp on retina yet not twice too big.
 */
async function renderLogo(displayHeight: number): Promise<Buffer> {
  return sharp(readFileSync(LOGO_SVG), { density: 384 })
    .resize({ height: Math.round(displayHeight * 2) })
    .png()
    .withMetadata({ density: 144 })
    .toBuffer();
}

/**
 * Renders the component to an HTML string with the resolved tokens. The logo is
 * deliberately omitted — it's pasted in separately (see renderLogo).
 */
function renderSignature(
  Component: ComponentType<EmailSignatureProps>,
  identity: Identity,
  contact: Contact,
  tokens: SignatureTokens,
): string {
  return render(
    h(Component, {
      fullName: identity.fullName,
      role: identity.role,
      website: identity.website,
      websiteLabel: identity.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      email: contact.email,
      phone: contact.phone,
      tokens,
    }),
  );
}

/**
 * Puts the signature on the macOS clipboard with an HTML flavour, so pasting
 * into a signature field keeps the formatting rather than dropping in markup.
 */
function copyHtmlToClipboard(html: string): void {
  if (process.platform !== 'darwin') {
    console.log('Clipboard copy is macOS-only — use --output or --stdout on this platform.');
    return;
  }
  const hex = Buffer.from(html, 'utf8').toString('hex');
  try {
    execFileSync('osascript', ['-e', `set the clipboard to «data HTML${hex}»`]);
    console.log('✓ Copied signature to the clipboard — paste it into your mail signature.');
  } catch (cause) {
    throw new Error('Failed to copy to the clipboard via osascript.', { cause });
  }
}

/**
 * Second half of the paste flow: once the signature (with its placeholder tile)
 * is in the mail editor, hand over the actual PNG on the clipboard so it can be
 * pasted over the placeholder. Pasting a real image embeds it as a `cid:`
 * attachment — robust across clients that strip an inline image `src`. macOS
 * only; the prompt is skipped when stdin isn't a TTY.
 */
async function copyLogoStep(png: Buffer): Promise<void> {
  if (process.platform !== 'darwin') return;
  console.log(
    '\n  The signature has no logo — paste it into your mail signature first, then\n' +
      '  paste the logo image below the divider. Many clients drop an inline image,\n' +
      '  but a pasted image embeds as an attachment they all render.\n',
  );
  if (process.stdin.isTTY) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    await rl.question('  Press Enter to copy the logo image to the clipboard… ');
    rl.close();
  }
  copyImageToClipboard(png);
  console.log('✓ Logo image copied — click below the divider and paste to add the tile.');
}

/**
 * Puts a PNG on the macOS clipboard as image data (not markup). osascript reads
 * it as the `«class PNGf»` flavour from a short-lived temp file.
 */
function copyImageToClipboard(png: Buffer): void {
  const tmp = join(ROOT, `.signature-logo.${process.pid}.png`);
  writeFileSync(tmp, png);
  try {
    execFileSync('osascript', [
      '-e',
      `set the clipboard to (read (POSIX file ${JSON.stringify(tmp)}) as «class PNGf»)`,
    ]);
  } catch (cause) {
    throw new Error('Failed to copy the logo image via osascript.', { cause });
  } finally {
    rmSync(tmp, { force: true });
  }
}

function printUsage(): void {
  console.log(
    `Build the HTML e-mail signature and copy it to the clipboard (macOS).\n\n` +
      `Colours, sizes and spacing come from the design tokens; name, role and\n` +
      `website from site.config.ts. The private details (email, phone) are added\n` +
      `here and never touch source.\n\n` +
      `The logo is delivered in two steps: the signature is copied without a\n` +
      `logo, then (after you paste it) the real PNG is copied as an image — paste\n` +
      `it in below the divider so it embeds as an attachment, which clients render\n` +
      `even when they strip an inline image.\n\n` +
      `Usage:\n` +
      `  pnpm signature --email me@example.com --phone "+45 12 34 56 78"\n` +
      `  pnpm signature --options ./my-details.json\n` +
      `  pnpm signature --email me@example.com --output signature.html\n\n` +
      `Private options: ${CONTACT_FIELDS.map((f) => `--${f}`).join(' ')}\n` +
      `  --options, -o <file>  JSON file with email/phone (CLI flags win)\n` +
      `  --output <file>       Also write the signature HTML to a file\n` +
      `  --stdout              Print the signature HTML to stdout\n` +
      `  --no-clipboard        Skip copying to the clipboard\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
