import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const LIMIT_BYTES = 10 * 1024;
const DIST = './dist';
const ASTRO_DIR = './dist/_astro';

const entries = await readdir(DIST, { recursive: true, withFileTypes: true });
const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.html'))
  .map((e) => join(e.parentPath, e.name));

const referenced = new Set();
const pattern = /_astro\/([\w.-]+\.js)/g;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(pattern)) {
    referenced.add(match[1]);
  }
}

let total = 0;
for (const name of referenced) {
  const buf = await readFile(join(ASTRO_DIR, name));
  total += gzipSync(buf).length;
}

const kib = (total / 1024).toFixed(2);
console.log(
  `JS shipped to users: ${total} B gzipped (${kib} KiB) across ${referenced.size} file(s). Limit: ${LIMIT_BYTES} B.`,
);

if (total > LIMIT_BYTES) {
  console.error(`Shipped JS exceeds the ${LIMIT_BYTES} B gzipped limit.`);
  process.exit(1);
}
