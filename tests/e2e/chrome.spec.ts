import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/site.config';

test.describe('Top bar', () => {
  test('exposes print, GitHub, and theme toggle controls', async ({ page }) => {
    await page.goto('/');
    const topbar = page.getByRole('banner');
    await expect(topbar).toBeVisible();
    await expect(topbar.getByRole('button', { name: /print/i })).toBeVisible();
    await expect(topbar.getByRole('link', { name: /github/i })).toBeVisible();
    await expect(topbar.getByRole('button', { name: /toggle theme/i })).toBeVisible();
  });

  test('spans the full viewport width', async ({ page }) => {
    await page.goto('/');
    const topbar = page.getByRole('banner');
    const width = await topbar.evaluate((el) => el.getBoundingClientRect().width);
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(width).toBe(viewport?.width);
  });
});

test.describe('Footer', () => {
  test('shows copyright and links to the open-source repository', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByText(siteConfig.fullName)).toBeVisible();
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
  test('hides chrome, forces light tokens, swaps chips for the print skill list', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // The hero profile photo is print-only — absent from the on-screen view.
    const photo = page.locator('img[src="/profile.jpg"]');
    await expect(photo).toBeHidden();

    await page.emulateMedia({ media: 'print', colorScheme: 'dark' });

    await expect(page.getByRole('banner')).toBeHidden();
    await expect(page.getByRole('contentinfo')).toBeHidden();

    await expect(page.getByText('Available for new projects.')).toBeHidden();
    await expect(page.getByRole('link', { name: /get in touch/i })).toBeHidden();
    await expect(page.getByRole('link', { name: /all skills/i })).toBeHidden();
    await expect(page.getByRole('button', { name: /more/i }).first()).toBeHidden();

    const surface = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim(),
    );
    expect(surface).toBe('oklch(100% 0 0)');

    // The interactive chips give way to a plain comma-separated print list (a
    // <p>, vs the chips' <span>), which ends with a static "+N more".
    await expect(page.locator('span[data-variant]').first()).toBeHidden();
    const printList = page.locator('p[data-variant]').first();
    await expect(printList).toBeVisible();
    await expect(printList).toContainText(/\+\d+ more/);

    // ...and rides along on the printed CV.
    await expect(photo).toBeVisible();
  });

  test('passes axe accessibility audit in print media', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
