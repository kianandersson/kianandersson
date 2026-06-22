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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { transform } from 'esbuild';
import { type ComponentType, h } from 'preact';
import { render } from 'preact-render-to-string';
import type {
  EmailSignatureProps,
  SignatureTokenManifest,
  SignatureTokens,
} from '../src/artifacts/EmailSignature/EmailSignature';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TOKENS_CSS = join(ROOT, 'src/styles/tokens.css');
const SITE_CONFIG = join(ROOT, 'src/site.config.ts');
const COMPONENT = join(ROOT, 'src/artifacts/EmailSignature/EmailSignature.tsx');
const DEFAULT_OPTIONS_FILE = join(ROOT, 'print.options.json');

const CONTACT_FIELDS = ['email', 'phone'] as const;
type ContactField = (typeof CONTACT_FIELDS)[number];
type Contact = Partial<Record<ContactField, string>>;

type Identity = { fullName: string; mark: string; role: string; website: string };

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
 * not. The wordmark is the two initials, matching the brand mark.
 */
function readIdentity(): Identity {
  const src = readFileSync(SITE_CONFIG, 'utf8');
  const pick = (key: string): string => {
    const match = src.match(new RegExp(`${key}:\\s*'([^']*)'`));
    if (!match) throw new Error(`Could not read ${key} from site.config.ts`);
    return match[1];
  };
  const firstName = pick('firstName');
  const lastName = pick('lastName');
  return {
    fullName: `${firstName} ${lastName}`,
    mark: `${firstName[0]}${lastName[0]}`.toLowerCase(),
    role: pick('role'),
    website: pick('website'),
  };
}

/**
 * Loads tokens.css into a headless Chromium and reads each token's resolved
 * value the way the browser computes it: colours flattened to sRGB hex (via a
 * 1×1 canvas, so oklch survives into a value every e-mail client understands),
 * lengths as px, leadings as ratios, fonts as their full fallback stack.
 */
async function resolveTokens(manifest: SignatureTokenManifest): Promise<SignatureTokens> {
  const css = readFileSync(TOKENS_CSS, 'utf8');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head><body></body></html>`,
    );
    const resolved = (await page.evaluate(({ color, length, ratio, font }) => {
      const probe = document.body.appendChild(document.createElement('div'));
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d', { colorSpace: 'srgb' }) as CanvasRenderingContext2D;

      const toHex = (token: string): string => {
        probe.style.color = `var(${token})`;
        ctx.fillStyle = '#000';
        ctx.fillStyle = getComputedStyle(probe).color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
      };
      const toLength = (token: string): string => {
        probe.style.width = `var(${token})`;
        return getComputedStyle(probe).width;
      };
      const toRatio = (token: string): string => {
        probe.style.fontSize = '1000px';
        probe.style.lineHeight = `var(${token})`;
        const value = Number.parseFloat(getComputedStyle(probe).lineHeight) / 1000;
        probe.style.fontSize = '';
        probe.style.lineHeight = '';
        return String(value);
      };
      const toFont = (token: string): string => {
        probe.style.fontFamily = `var(${token})`;
        // Single-quote family names so they survive inside a double-quoted
        // style attribute, matching the e-mail convention.
        return getComputedStyle(probe).fontFamily.replace(/"/g, "'");
      };

      const resolve = (tokens: readonly string[], fn: (t: string) => string) =>
        Object.fromEntries(tokens.map((token) => [token, fn(token)]));

      return {
        ...resolve(color, toHex),
        ...resolve(length, toLength),
        ...resolve(ratio, toRatio),
        ...resolve(font, toFont),
      } as Record<string, string>;
    }, manifest)) as SignatureTokens;

    return resolved;
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

/** Renders the component to an HTML string with the resolved tokens. */
function renderSignature(
  Component: ComponentType<EmailSignatureProps>,
  identity: Identity,
  contact: Contact,
  tokens: SignatureTokens,
): string {
  return render(
    h(Component, {
      mark: identity.mark,
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

function printUsage(): void {
  console.log(
    `Build the HTML e-mail signature and copy it to the clipboard (macOS).\n\n` +
      `Colours, sizes and spacing come from the design tokens; name, role and\n` +
      `website from site.config.ts. The private details (email, phone) are added\n` +
      `here and never touch source.\n\n` +
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
