import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero heading and CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Kian.");
    await expect(page.getByRole('link', { name: /Get in touch/i })).toHaveAttribute(
      'href',
      'mailto:mail@kianandersson.dk',
    );
  });

  test('passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
