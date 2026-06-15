import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

const CLIENT_DIST = join('dist', 'client');
const ASTRO_DIR = join(CLIENT_DIST, '_astro');
const LIMIT_BYTES = 12 * 1024;
const SCRIPT_REFERENCE = /_astro\/([\w.-]+\.js)/g;

describe('shipped JS bundle', () => {
  it(`stays under ${LIMIT_BYTES / 1024} KiB gzipped`, async () => {
    const scripts = await collectReferencedScripts();
    const sizes = await Promise.all(scripts.map(gzippedSize));
    const total = sizes.reduce((sum, n) => sum + n, 0);

    expect(total, summary(total, scripts.length)).toBeLessThanOrEqual(LIMIT_BYTES);
  });
});

async function collectReferencedScripts(): Promise<string[]> {
  const entries = await readdir(CLIENT_DIST, { recursive: true, withFileTypes: true });
  const htmlFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => join(e.parentPath, e.name));

  const referenced = new Set<string>();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const [, name] of html.matchAll(SCRIPT_REFERENCE)) {
      referenced.add(name);
    }
  }
  return [...referenced];
}

async function gzippedSize(scriptName: string): Promise<number> {
  const buf = await readFile(join(ASTRO_DIR, scriptName));
  return gzipSync(buf).length;
}

function summary(bytes: number, count: number): string {
  return `JS shipped to users: ${bytes} B (${(bytes / 1024).toFixed(2)} KiB) gzipped across ${count} file(s)`;
}
