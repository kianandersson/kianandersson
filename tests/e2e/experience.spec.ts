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

  test('every entry has a role, stack group and methods group', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Experience/i });
    const entries = section.getByRole('listitem');
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      const entry = entries.nth(i);
      await expect(entry.getByRole('heading', { level: 3 })).toBeVisible();
      await expect(entry.getByText('Stack', { exact: true })).toBeVisible();
      await expect(entry.getByText('Methods', { exact: true })).toBeVisible();
    }
  });

  test('reveals more chips when the user clicks "more"', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Experience/i });
    const moreToggle = section.getByRole('button', { name: /more/i }).first();
    await moreToggle.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => !document.querySelector('astro-island')?.hasAttribute('ssr'),
    );

    const entry = section.getByRole('listitem').first();
    const chips = entry.locator('[data-variant]');
    const chipsBefore = await chips.count();

    await moreToggle.click();
    await expect(section.getByRole('button', { name: /less/i }).first()).toBeVisible();
    expect(await chips.count()).toBeGreaterThan(chipsBefore);

    const lessToggle = section.getByRole('button', { name: /less/i }).first();
    await lessToggle.click();
    await expect(section.getByRole('button', { name: /more/i }).first()).toBeVisible();
    expect(await chips.count()).toBe(chipsBefore);
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
