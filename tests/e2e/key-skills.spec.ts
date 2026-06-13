import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Key Skills section', () => {
  test('renders the heading and the six key skills', async ({ page }) => {
    await page.goto('/');

    const section = page.getByRole('region', { name: /Key skills/i });
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2, name: /Key skills/i })).toBeVisible();

    for (const name of ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Go']) {
      await expect(section.getByText(name, { exact: true })).toBeVisible();
    }
  });

  test('renders five dots per row, lit according to the skill level', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /Key skills/i });

    const typescriptRow = section.getByRole('listitem').filter({ hasText: 'TypeScript' });
    await expect(typescriptRow.locator('[data-state="on"]')).toHaveCount(5);
    await expect(typescriptRow.locator('[data-state="off"]')).toHaveCount(0);

    const goRow = section.getByRole('listitem').filter({ hasText: /^Go/ });
    await expect(goRow.locator('[data-state="on"]')).toHaveCount(2);
    await expect(goRow.locator('[data-state="off"]')).toHaveCount(3);
  });

  test('keeps name and meta on the same line at desktop widths', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    const row = page.getByRole('listitem').filter({ hasText: 'TypeScript' });
    const nameBox = await row.getByText('TypeScript').boundingBox();
    const levelBox = await row.getByText('Expert').boundingBox();

    expect(nameBox).not.toBeNull();
    expect(levelBox).not.toBeNull();
    if (!nameBox || !levelBox) return;
    expect(Math.abs(levelBox.y - nameBox.y)).toBeLessThan(8);
  });

  test('stacks meta beneath the name at narrow viewports', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const row = page.getByRole('listitem').filter({ hasText: 'TypeScript' });
    const nameBox = await row.getByText('TypeScript').boundingBox();
    const levelBox = await row.getByText('Expert').boundingBox();

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
