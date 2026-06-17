import { expect, type Route, test } from '@playwright/test';
import { stringify as devalueStringify } from 'devalue';

const CONTACT_ENDPOINT = /\/_actions\/contact\.send/;

async function openForm(page: import('@playwright/test').Page) {
  await page.goto('/');
  const trigger = page.locator('button[aria-controls]').first();
  await trigger.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('astro-island')?.hasAttribute('ssr'));
  await trigger.click();
  await expect(page.getByRole('form', { name: /contact/i })).toBeVisible();
}

async function fillValid(page: import('@playwright/test').Page) {
  await page.getByLabel('From').pressSequentially('jane@example.com');
  await page.getByLabel('Subject').pressSequentially('Project enquiry');
  await page.getByLabel('Message').pressSequentially('Hello — would love to chat.');
  // Confirm the controlled inputs flushed their state before we submit; if the
  // Send button stayed disabled here, the form's `valid` flag never flipped.
  await expect(page.getByRole('button', { name: /send message/i })).toBeEnabled();
}

test.describe('Contact submit flow', () => {
  test('keeps Send disabled until email, subject and message are valid', async ({ page }) => {
    let actionCalled = false;
    await page.route(CONTACT_ENDPOINT, (route: Route) => {
      actionCalled = true;
      return route.abort();
    });

    await openForm(page);

    const send = page.getByRole('button', { name: /send message/i });
    await expect(send).toBeDisabled();

    await page.getByLabel('From').fill('not-an-email');
    await page.getByLabel('Subject').fill('Hello');
    await page.getByLabel('Message').fill('Hi');
    await expect(send).toBeDisabled();

    expect(actionCalled).toBe(false);
  });

  test('shows the success line and auto-collapses on a successful send', async ({ page }) => {
    await page.route(CONTACT_ENDPOINT, (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json+devalue',
        body: devalueStringify({ ok: true }),
      }),
    );

    await openForm(page);
    await fillValid(page);
    await page.getByRole('button', { name: /send message/i }).click();

    // Plane flight (500ms) + form leave (140ms) before the success line lands.
    await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 3000 });

    // The form region auto-collapses after the success delay.
    const trigger = page.locator('button[aria-controls]').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false', { timeout: 6000 });
  });

  test('shows the error line when the action returns an ActionError', async ({ page }) => {
    await page.route(CONTACT_ENDPOINT, (route: Route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'AstroActionError',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Mock failure',
        }),
      }),
    );

    await openForm(page);
    await fillValid(page);
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/Couldn't send/i)).toBeVisible({ timeout: 3000 });

    // Trigger stays open so the user can retry.
    const trigger = page.locator('button[aria-controls]').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
