import { act, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactCta } from './ContactCta';

const RECIPIENT = 'Kian Andersson';
const FUTURE = new Date('2099-09-01T00:00:00Z');
const PAST = new Date('2000-01-01T00:00:00Z');

describe('ContactCta', () => {
  it('renders the "no status" solid button when availableFrom is missing', () => {
    render(<ContactCta recipientName={RECIPIENT} />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button).toHaveAttribute('data-availability', 'none');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the "available" pill with an ok-toned dot for a past date', () => {
    render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);
    const button = screen.getByRole('button', {
      name: /get in touch — available for work/i,
    });
    expect(button).toHaveAttribute('data-availability', 'available');
    expect(button.querySelector('[data-tone="ok"]')).not.toBeNull();
  });

  it('renders the "future" pill with a warn-toned dot and a formatted start date', () => {
    render(<ContactCta recipientName={RECIPIENT} availableFrom={FUTURE} />);
    const button = screen.getByRole('button', {
      name: /get in touch — available from 01\.09\.2099/i,
    });
    expect(button).toHaveAttribute('data-availability', 'future');
    expect(button.querySelector('[data-tone="warn"]')).not.toBeNull();
    expect(button.textContent).toContain('01.09.2099');
  });

  it('toggles the contact form open and closed on click', async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);

    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('[data-open="true"]')).toBeNull();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close contact form');
    expect(container.querySelector(`#contact-region[data-open="true"]`)).not.toBeNull();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not leak an email address into the DOM', () => {
    const { container } = render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);
    expect(container.textContent).not.toContain('@');
  });

  describe('submit flow (demo mode)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows the success line, then auto-collapses and resets', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
      render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);

      await user.click(screen.getByRole('button', { name: /get in touch/i }));
      await user.type(screen.getByLabelText(/from/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(750 + 280 + 220);
      });
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3200 + 400);
      });
      const pill = screen.getByRole('button', { name: /get in touch/i });
      expect(pill).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(560);
      });
      expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    });
  });
});
