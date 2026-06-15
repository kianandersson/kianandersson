import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/site.config';

test.describe('Home page', () => {
  test('renders the hero heading and contact CTA button', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      `Hi, I'm ${siteConfig.firstName}.`,
    );

    const cta = page.getByRole('button', { name: /get in touch/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens the inline contact form when the CTA is clicked', async ({ page }) => {
    await page.goto('/');

    // The accessible name flips between "Get in touch …" and "Close contact form"
    // as the form toggles open, so anchor on the stable aria-controls attribute.
    const cta = page.locator('button[aria-controls="contact-region"]');
    await cta.click();

    await expect(cta).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('form', { name: /contact/i })).toBeVisible();
    await expect(page.getByLabel('From')).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  test('never exposes an email address in the rendered HTML', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('@');
    expect(html).not.toContain('mailto:');
  });

  test('passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
