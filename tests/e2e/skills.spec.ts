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

  test('expanding a group reveals its skills, collapsing hides them again', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /^Skills$/i });
    const trigger = section.getByRole('button').first();

    await trigger.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));

    const panelId = await trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = section.locator(`#${panelId}`);

    await expect(panel).toBeHidden();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    expect(await panel.getByRole('listitem').count()).toBeGreaterThan(0);

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });

  test('keeps only one group open at a time', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', { name: /^Skills$/i });
    const triggers = section.getByRole('button');
    expect(await triggers.count()).toBeGreaterThanOrEqual(2);
    const first = triggers.nth(0);
    const second = triggers.nth(1);

    await first.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));

    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
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
