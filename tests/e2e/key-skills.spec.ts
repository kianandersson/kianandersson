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

    const typescriptRow = section.locator('div', { hasText: /^TypeScript/ }).first();
    await expect(typescriptRow.locator('[data-state="on"]')).toHaveCount(5);
    await expect(typescriptRow.locator('[data-state="off"]')).toHaveCount(0);

    const goRow = section.locator('div', { hasText: /^Go/ }).first();
    await expect(goRow.locator('[data-state="on"]')).toHaveCount(2);
    await expect(goRow.locator('[data-state="off"]')).toHaveCount(3);
  });

  test('passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
