import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Skills section', () => {
  test('renders the section heading', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /^Skills$/i });
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2, name: /^Skills$/i })).toBeVisible();
  });

  test('renders at least one collapsed group trigger', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /^Skills$/i });
    const triggers = section.getByRole('button');
    const count = await triggers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(triggers.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('does not horizontally scroll the page at 360px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const pageOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });
    expect(pageOverflow).toBeLessThanOrEqual(0);
  });

  test('passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
