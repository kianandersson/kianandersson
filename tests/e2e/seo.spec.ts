import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import astroConfig from '../../astro.config.mjs';
import { OG_IMAGE_SIZE } from '../../src/lib/og';
import { siteConfig } from '../../src/site.config';

test.describe('SEO surfaces', () => {
  test('home advertises OG image and twitter large card', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${astroConfig.site}/og.png`,
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      String(OG_IMAGE_SIZE.width),
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      String(OG_IMAGE_SIZE.height),
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
  });

  test('home suppresses the search-result image preview', async ({ page }) => {
    await page.goto('/');

    // Keeps Google from cropping the wide OG card into a thumbnail beside the
    // result, without touching og:/twitter: previews used for social sharing.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'max-image-preview:none',
    );
  });

  test('home declares og:site_name and profile metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      siteConfig.fullName,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    await expect(page.locator('meta[property="og:profile:first_name"]')).toHaveAttribute(
      'content',
      siteConfig.firstName,
    );
    await expect(page.locator('meta[property="og:profile:last_name"]')).toHaveAttribute(
      'content',
      siteConfig.lastName,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      siteConfig.defaultTitle,
    );
  });

  test('home JSON-LD exposes a Person with employment and skills shape', async ({ page }) => {
    await page.goto('/');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).not.toBeNull();
    const data = JSON.parse(jsonLd ?? '{}');

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.image).toBe(`${astroConfig.site}/profile.jpg`);

    // worksFor only appears while a current role is held; otherwise it is
    // correctly omitted and every experience surfaces under alumniOf instead.
    const hasCurrent = data.worksFor !== undefined;
    if (hasCurrent) {
      expect(data.worksFor).toMatchObject({ '@type': 'Organization' });
      expect(typeof data.worksFor.name).toBe('string');
      expect(data.worksFor.name.length).toBeGreaterThan(0);
    }

    expect(Array.isArray(data.alumniOf)).toBe(true);
    expect(data.alumniOf.length).toBeGreaterThan(0);
    for (const org of data.alumniOf) {
      expect(org).toMatchObject({ '@type': 'Organization' });
      expect(typeof org.name).toBe('string');
      expect(org.name.length).toBeGreaterThan(0);
    }

    expect(Array.isArray(data.hasOccupation)).toBe(true);
    expect(data.hasOccupation.length).toBeGreaterThan(0);
    if (hasCurrent) {
      expect(data.hasOccupation[0]).toMatchObject({ '@type': 'Occupation' });
      expect(typeof data.hasOccupation[0].name).toBe('string');
      expect(data.hasOccupation[0].name.length).toBeGreaterThan(0);
    }
    const pastRoles = hasCurrent ? data.hasOccupation.slice(1) : data.hasOccupation;
    for (const role of pastRoles) {
      expect(role).toMatchObject({
        '@type': 'Role',
        startDate: expect.stringMatching(/^\d{4}-\d{2}$/),
        endDate: expect.stringMatching(/^\d{4}-\d{2}$/),
        hasOccupation: expect.objectContaining({ '@type': 'Occupation' }),
      });
    }

    expect(Array.isArray(data.knowsAbout)).toBe(true);
    expect(data.knowsAbout.length).toBeGreaterThan(0);
    for (const skill of data.knowsAbout) {
      expect(typeof skill).toBe('string');
      expect(skill.length).toBeGreaterThan(0);
    }
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
