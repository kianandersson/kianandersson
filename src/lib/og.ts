/**
 * Open Graph image dimensions — the single source of truth shared by the render
 * canvas (`/og`), the screenshot integration that snapshots it into `/og.png`,
 * and the `og:image:width`/`height` meta tags. Keep them in one place so the
 * declared size can never drift from the rendered one.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
