import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Top bar', () => {
  test('exposes GitHub link and theme toggle', async ({ page }) => {
    await page.goto('/');
    const topbar = page.locator('[data-chrome="top"]');
    await expect(topbar).toBeVisible();
    await expect(topbar.getByRole('link', { name: /github/i })).toBeVisible();
    await expect(topbar.getByRole('button', { name: /toggle theme/i })).toBeVisible();
  });

  test('spans the full viewport width', async ({ page }) => {
    await page.goto('/');
    const topbar = page.locator('[data-chrome="top"]');
    const width = await topbar.evaluate((el) => el.getBoundingClientRect().width);
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(width).toBe(viewport?.width);
  });
});

test.describe('Footer', () => {
  test('shows copyright and links to the open-source repository', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('[data-chrome="bottom"]');
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/Kian Andersson/i)).toBeVisible();
    const sourceLink = footer.getByRole('link', { name: /open-source/i });
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute('href', /github/i);
  });
});

test.describe('Theme toggle', () => {
  test('flips the theme and persists across reloads', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const toggle = page.getByRole('button', { name: /toggle theme/i });
    await toggle.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: /toggle theme/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('respects prefers-color-scheme on first load when no choice is stored', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('Print media', () => {
  test('hides chrome, forces light tokens, and reveals collapsed content', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.emulateMedia({ media: 'print', colorScheme: 'dark' });

    await expect(page.locator('[data-chrome="top"]')).toBeHidden();
    await expect(page.locator('[data-chrome="bottom"]')).toBeHidden();

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    );
    expect(bg).toBe('#ffffff');

    const allChips = page.locator('[data-variant]');
    const chipCount = await allChips.count();
    expect(chipCount).toBeGreaterThan(0);
    for (let i = 0; i < chipCount; i++) {
      await expect(allChips.nth(i)).toBeVisible();
    }
  });

  test('passes axe accessibility audit in print media', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
