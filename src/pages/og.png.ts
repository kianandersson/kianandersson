import type { APIRoute } from 'astro';
import { generateOpenGraphImage } from 'astro-og-canvas';
import { siteConfig } from '../site.config';

export const GET: APIRoute = async () => {
  const png = await generateOpenGraphImage({
    title: siteConfig.name,
    description: `Senior Fullstack Engineer · ${siteConfig.location}`,
    bgGradient: [
      [244, 243, 241],
      [255, 255, 255],
    ],
    border: { color: [176, 62, 36], width: 12, side: 'inline-start' },
    font: {
      title: { color: [29, 29, 31], size: 80, weight: 'Bold' },
      description: { color: [80, 80, 90], size: 36, weight: 'Normal' },
    },
    padding: 80,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
