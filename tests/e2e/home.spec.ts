import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/site.config';

test.describe('Home page', () => {
  test('renders the hero heading and CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      `Hi, I'm ${siteConfig.firstName}.`,
    );
    await expect(page.getByRole('link', { name: /Get in touch/i })).toHaveAttribute(
      'href',
      `mailto:${siteConfig.email}`,
    );
  });

  test('passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
