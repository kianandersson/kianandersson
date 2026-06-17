import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactButton } from './ContactButton';

const baseProps = {
  isOpen: false,
  ariaLabel: 'Get in touch',
  controlsId: 'contact-region',
  onClick: vi.fn(),
};

describe('ContactButton', () => {
  it('renders the labelled variant with visible "Get in touch" text', () => {
    render(<ContactButton {...baseProps} variant="labelled" />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button.textContent).toContain('Get in touch');
  });

  it('renders the icon variant with no visible text', () => {
    render(<ContactButton {...baseProps} variant="icon" />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button.textContent?.trim()).toBe('');
  });

  it('exposes the controlled state via aria-expanded and aria-controls', () => {
    render(<ContactButton {...baseProps} variant="icon" isOpen={true} />);
    const button = screen.getByRole('button', { name: /get in touch/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'contact-region');
  });

  it('invokes onClick on activation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ContactButton {...baseProps} variant="labelled" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
