import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro `site` must be configured to generate robots.txt');
  }

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /_storybook/',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).toString()}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
