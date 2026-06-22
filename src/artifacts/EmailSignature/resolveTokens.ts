import type { SignatureTokenManifest, SignatureTokens } from './EmailSignature';

/**
 * Resolves each design token to a flat, e-mail-safe value the way the browser
 * computes it: colours flattened to sRGB hex (via a 1×1 canvas, so oklch
 * survives into a value every client understands), lengths to px, leadings to
 * ratios, fonts to their full fallback stack.
 *
 * One resolver, two callers: the CLI ships this very function into a headless
 * Chromium with `page.evaluate`, and Storybook calls it directly in its own
 * browser. Keep it self-contained — no closure over module scope or imports —
 * so `page.evaluate` can serialise it intact.
 */
export function resolveSignatureTokens(manifest: SignatureTokenManifest): SignatureTokens {
  const { color, length, ratio, font } = manifest;
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
    // Single-quote family names so they survive inside a double-quoted style
    // attribute, matching the e-mail convention.
    return getComputedStyle(probe).fontFamily.replace(/"/g, "'");
  };

  const resolve = (tokens: readonly string[], fn: (t: string) => string) =>
    Object.fromEntries(tokens.map((token) => [token, fn(token)]));

  try {
    return {
      ...resolve(color, toHex),
      ...resolve(length, toLength),
      ...resolve(ratio, toRatio),
      ...resolve(font, toFont),
    } as SignatureTokens;
  } finally {
    // Storybook resolves on every render, so leave the page as we found it.
    probe.remove();
  }
}
