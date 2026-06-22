import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Experience section', () => {
  test('renders the section heading', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Experience/i });
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2, name: /Experience/i })).toBeVisible();
  });

  test('renders at least one experience entry', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Experience/i });
    const entries = section.getByRole('listitem');
    expect(await entries.count()).toBeGreaterThan(0);
  });

  test('every entry has a role, stack group and domains group', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Experience/i });
    const entries = section.getByRole('listitem');
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      const entry = entries.nth(i);
      await expect(entry.getByRole('heading', { level: 3 })).toBeVisible();
      await expect(entry.getByText('Stack', { exact: true })).toBeVisible();
      await expect(entry.getByText('Domains', { exact: true })).toBeVisible();
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
