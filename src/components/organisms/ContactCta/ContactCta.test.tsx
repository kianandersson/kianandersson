import { actions } from 'astro:actions';
import { act, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactCta } from './ContactCta';

const sendMock = actions.contact.send as unknown as ReturnType<typeof vi.fn>;

const RECIPIENT = 'Kian Andersson';
const FUTURE = new Date('2099-09-01T00:00:00Z');
const PAST = new Date('2000-01-01T00:00:00Z');

describe('ContactCta', () => {
  it('renders the labelled "Get in touch" pill when availableFrom is missing', () => {
    const { container } = render(<ContactCta recipientName={RECIPIENT} />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    // Labelled variant has visible "Get in touch" text inside the button.
    expect(button.textContent).toContain('Get in touch');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // No availability pill should render in the no-status case.
    expect(container.querySelector('[data-state="available"]')).toBeNull();
    expect(container.querySelector('[data-state="future"]')).toBeNull();
  });

  it('renders the icon-only round button alongside an "available" pill for a past date', () => {
    const { container } = render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);
    const button = screen.getByRole('button', {
      name: /get in touch/i,
    });
    // Icon variant has no visible text — only icons.
    expect(button.textContent?.trim()).toBe('');
    expect(container.querySelector('[data-state="available"]')).not.toBeNull();
    expect(container.querySelector('[data-tone="success"]')).not.toBeNull();
    expect(screen.getByText('Available for work')).toBeInTheDocument();
  });

  it('renders the icon-only round button alongside a "future" pill with formatted date', () => {
    const { container } = render(<ContactCta recipientName={RECIPIENT} availableFrom={FUTURE} />);
    const button = screen.getByRole('button', {
      name: /get in touch — available from 1 sep/i,
    });
    expect(button.textContent?.trim()).toBe('');
    expect(container.querySelector('[data-state="future"]')).not.toBeNull();
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
    expect(screen.getByText('1 Sep')).toBeInTheDocument();
  });

  it('toggles the contact form open and closed on click', async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);

    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('#contact-region[data-open="true"]')).toBeNull();

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

  describe('submit flow', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      sendMock.mockReset();
      sendMock.mockResolvedValue({ data: { ok: true }, error: undefined });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows the success line, then auto-collapses and resets', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
      render(<ContactCta recipientName={RECIPIENT} availableFrom={PAST} />);

      await user.click(screen.getByRole('button', { name: /get in touch/i }));
      await user.type(screen.getByLabelText(/from/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Project enquiry');
      await user.type(screen.getByLabelText(/message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Past SUCCESS_ENTER_AFTER_MS (140ms): success line is in the DOM.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(280);
      });
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      // Past COLLAPSE_DELAY_MS + SUCCESS_LEAVE_MS: pill closes but the success
      // line stays in the DOM through its fade-out window.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3200 + 400);
      });
      const pill = screen.getByRole('button', { name: /get in touch/i });
      expect(pill).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      // Past RESET_DELAY_MS: state has been torn down.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(560);
      });
      expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    });
  });
});
