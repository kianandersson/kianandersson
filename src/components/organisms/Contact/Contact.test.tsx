import { actions } from 'astro:actions';
import { act, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDate } from '../../../lib/formatDate';
import { Contact } from './Contact';

const sendMock = actions.contact.send as unknown as ReturnType<typeof vi.fn>;

const RECIPIENT = 'Kian Andersson';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PAST = new Date(Date.now() - ONE_DAY_MS);
const FUTURE = new Date(Date.now() + 30 * ONE_DAY_MS);
const FUTURE_LABEL = formatDate(FUTURE);
const FUTURE_LABEL_PATTERN = FUTURE_LABEL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('Contact', () => {
  it('renders the labelled "Get in touch" button when availableFrom is missing', () => {
    const { container } = render(<Contact recipientName={RECIPIENT} />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button.textContent).toContain('Get in touch');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('[data-state="available"]')).toBeNull();
    expect(container.querySelector('[data-state="future"]')).toBeNull();
  });

  it('renders the icon-only round button alongside an "available" status for a past date', () => {
    const { container } = render(<Contact recipientName={RECIPIENT} availableFrom={PAST} />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button.textContent?.trim()).toBe('');
    expect(container.querySelector('[data-state="available"]')).not.toBeNull();
    expect(container.querySelector('[data-tone="success"]')).not.toBeNull();
    expect(screen.getByText('Available for work')).toBeInTheDocument();
  });

  it('renders the icon-only round button alongside a "future" status with formatted date', () => {
    const { container } = render(<Contact recipientName={RECIPIENT} availableFrom={FUTURE} />);
    const button = screen.getByRole('button', {
      name: new RegExp(`get in touch — available from ${FUTURE_LABEL_PATTERN}`, 'i'),
    });
    expect(button.textContent?.trim()).toBe('');
    expect(container.querySelector('[data-state="future"]')).not.toBeNull();
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
    expect(screen.getByText(FUTURE_LABEL)).toBeInTheDocument();
  });

  it('toggles the contact form open and closed on click', async () => {
    const user = userEvent.setup();
    const { container } = render(<Contact recipientName={RECIPIENT} availableFrom={PAST} />);

    const button = screen.getByRole('button', { name: /get in touch/i });
    const regionId = button.getAttribute('aria-controls');
    expect(regionId).not.toBeNull();
    const regionSelector = `#${CSS.escape(regionId as string)}`;
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector(`${regionSelector}[data-open="true"]`)).toBeNull();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close contact form');
    expect(container.querySelector(`${regionSelector}[data-open="true"]`)).not.toBeNull();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not leak an email address into the DOM', () => {
    const { container } = render(<Contact recipientName={RECIPIENT} availableFrom={PAST} />);
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
      render(<Contact recipientName={RECIPIENT} availableFrom={PAST} />);

      await user.click(screen.getByRole('button', { name: /get in touch/i }));
      await user.type(screen.getByLabelText(/from/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Project enquiry');
      await user.type(screen.getByLabelText(/message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Past planeFlightMs (500) + successEnterAfterMs (formLeaveMs/2 = 140):
      // the plane has flown, the form has animated out, the success line is in.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500 + 140);
      });
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3200 + 400);
      });
      const trigger = screen.getByRole('button', { name: /get in touch/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(560);
      });
      expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    });
  });
});
