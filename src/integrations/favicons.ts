import { readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import sharp from 'sharp';

/**
 * Two brand source marks, derived at build time so nothing is committed:
 *   icon-rounded.svg  Rounded brand tile — the favicon for browsers and Google.
 *                     Carries a `prefers-color-scheme: dark` swap that adapts in
 *                     Chrome/Firefox/Edge; raster outputs and Safari ignore it.
 *   icon-square.svg   Square, full-bleed version of the same tile — only for the
 *                     Apple touch icon, which iOS masks into a rounded square.
 */
const ROUNDED = new URL('../../assets/icon-rounded.svg', import.meta.url);
const SQUARE = new URL('../../assets/icon-square.svg', import.meta.url);

/** Dark brand background (slate-950), matching the tile's default fill. */
const BACKGROUND = { r: 0x16, g: 0x16, b: 0x18, alpha: 1 } as const;

type Output = { body: Buffer; contentType: string };

/** Rasterise an SVG buffer to a square PNG of the given size. */
function pngFrom(svg: Buffer, size: number, flatten = false): Promise<Buffer> {
  let pipeline = sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain' });
  if (flatten) pipeline = pipeline.flatten({ background: BACKGROUND });
  return pipeline.png().toBuffer();
}

/**
 * Packs PNG frames into a single .ico. Windows and every modern browser accept
 * PNG-compressed ICO entries, so we embed the PNGs verbatim.
 */
function encodeIco(frames: Buffer[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(frames.length, 4);

  const directory = Buffer.alloc(16 * frames.length);
  let offset = header.length + directory.length;
  const sizes = [16, 32, 48];
  frames.forEach((png, i) => {
    const size = sizes[i];
    const entry = directory.subarray(i * 16, i * 16 + 16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // offset
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...frames]);
}

/**
 * Builds the favicon set, keyed by the path it serves from:
 *   favicon.svg           Modern browsers — the rounded tile, shipped as-is
 *   favicon.ico           16/32/48 multi-res; covers Google search and legacy,
 *                         and is requested at the root by path
 *   apple-touch-icon.png  180x180, opaque square tile, for iOS (which masks it)
 */
async function buildFavicons(): Promise<Record<string, Output>> {
  const [rounded, square] = await Promise.all([readFile(ROUNDED), readFile(SQUARE)]);
  const icoFrames = await Promise.all([16, 32, 48].map((size) => pngFrom(rounded, size)));

  return {
    'favicon.svg': { body: rounded, contentType: 'image/svg+xml' },
    'favicon.ico': { body: encodeIco(icoFrames), contentType: 'image/x-icon' },
    'apple-touch-icon.png': { body: await pngFrom(square, 180, true), contentType: 'image/png' },
  };
}

/**
 * Generates the favicons from the brand SVGs in `assets/`.
 *
 * At build time the whole set is written into the output directory; in dev each
 * file is rendered on demand so the same paths resolve while you work. Nothing
 * is committed — every output, the SVG included, is a build artifact derived
 * from the source marks, so `assets/` stays the single source of truth.
 */
export function favicons(): AstroIntegration {
  return {
    name: 'favicons',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const set = await buildFavicons();
        await Promise.all(
          Object.entries(set).map(([name, { body }]) => writeFile(join(outDir, name), body)),
        );
        logger.info(`Wrote ${Object.keys(set).join(', ')}`);
      },

      'astro:server:setup': ({ server, logger }) => {
        // Prepend, so we answer before Vite's own asset transform — it otherwise
        // intercepts `/favicon.svg` (a known asset type) and 404s it.
        server.middlewares.stack.unshift({
          route: '',
          handle: async (
            req: IncomingMessage,
            res: ServerResponse,
            next: (err?: unknown) => void,
          ) => {
            const name = (req.url ?? '').replace(/^\/+/, '').split('?')[0];
            const set = await buildFavicons();
            if (!(name in set)) return next();
            try {
              res.setHeader('content-type', set[name].contentType);
              res.end(set[name].body);
            } catch (error) {
              logger.error(`Failed to render /${name}: ${error}`);
              res.statusCode = 500;
              res.end();
            }
          },
        });
      },
    },
  };
}
