import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('SEO surfaces', () => {
  test('home advertises OG image and twitter large card', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://kianandersson.dk/og.png',
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
  });

  test('home JSON-LD includes current employer and prior employers', async ({ page }) => {
    await page.goto('/');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).not.toBeNull();
    const data = JSON.parse(jsonLd ?? '{}');

    expect(data['@type']).toBe('Person');
    expect(data.worksFor).toMatchObject({
      '@type': 'Organization',
      name: 'Freelance',
    });
    expect(data.alumniOf).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Nordic SaaS ApS' }),
        expect.objectContaining({ name: 'Studio Nord' }),
        expect.objectContaining({ name: 'Webbureau' }),
      ]),
    );
    expect(data.hasOccupation[0]).toMatchObject({
      '@type': 'Occupation',
      name: 'Lead Engineer',
    });
    expect(data.hasOccupation.slice(1)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'Role',
          startDate: expect.stringMatching(/^\d{4}-\d{2}$/),
          endDate: expect.stringMatching(/^\d{4}-\d{2}$/),
          hasOccupation: expect.objectContaining({ '@type': 'Occupation' }),
        }),
      ]),
    );
    expect(Array.isArray(data.knowsAbout)).toBe(true);
    expect(data.knowsAbout).toEqual(expect.arrayContaining(['TypeScript', 'React']));
    expect(data.knowsAbout).not.toContain('Go');
  });

  test('og.png is a real PNG', async ({ request }) => {
    const response = await request.get('/og.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const body = await response.body();
    expect(body.byteLength).toBeGreaterThan(1000);
    expect(body.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });

  test('sitemap-index is served', async ({ request }) => {
    const response = await request.get('/sitemap-index.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('sitemap-0.xml');
  });

  test('404 renders and is axe-clean', async ({ page }) => {
    await page.goto('/this-page-does-not-exist', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      "This page couldn't be found.",
    );
    await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    await expect(page.locator('#requested-url')).toContainText('/this-page-does-not-exist');
    await expect(page.getByRole('banner').getByRole('button', { name: /print/i })).toHaveCount(0);

    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
    );

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
