import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Key Skills section', () => {
  test('renders the section heading', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Key skills/i });
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2, name: /Key skills/i })).toBeVisible();
  });

  test('renders at least one skill row', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Key skills/i });
    const rows = section.getByRole('listitem');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('every row shows exactly five dots, split between on and off', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Key skills/i });
    const rows = section.getByRole('listitem');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const onCount = await row.locator('[data-state="on"]').count();
      const offCount = await row.locator('[data-state="off"]').count();
      expect(onCount + offCount).toBe(5);
      expect(onCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('keeps name and level on the same line at desktop widths', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    const row = page.getByRole('region', { name: /Key skills/i }).getByRole('listitem').first();
    const cells = row.locator(':scope > span');
    const nameBox = await cells.nth(0).boundingBox();
    const levelBox = await cells.nth(1).boundingBox();

    expect(nameBox).not.toBeNull();
    expect(levelBox).not.toBeNull();
    if (!nameBox || !levelBox) return;
    expect(Math.abs(levelBox.y - nameBox.y)).toBeLessThan(8);
  });

  test('stacks the level beneath the name at narrow viewports', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const row = page.getByRole('region', { name: /Key skills/i }).getByRole('listitem').first();
    const cells = row.locator(':scope > span');
    const nameBox = await cells.nth(0).boundingBox();
    const levelBox = await cells.nth(1).boundingBox();

    expect(nameBox).not.toBeNull();
    expect(levelBox).not.toBeNull();
    if (!nameBox || !levelBox) return;
    expect(levelBox.y).toBeGreaterThanOrEqual(nameBox.y + nameBox.height - 2);
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
