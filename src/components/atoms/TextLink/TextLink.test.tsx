import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextLink } from './TextLink';

describe('TextLink', () => {
  it('renders as an anchor with the href', () => {
    render(<TextLink href="#section">All skills →</TextLink>);
    const link = screen.getByRole('link', { name: /all skills/i });
    expect(link).toHaveAttribute('href', '#section');
  });

  it('renders as a button with type=button by default', () => {
    render(<TextLink onClick={() => undefined}>Show less</TextLink>);
    const button = screen.getByRole('button', { name: /show less/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies a tone-specific class', () => {
    const { container, rerender } = render(<TextLink href="/">Link</TextLink>);
    // muted is the default
    expect(container.firstElementChild?.className).toMatch(/_muted_/);

    rerender(
      <TextLink href="/" tone="default">
        Link
      </TextLink>,
    );
    expect(container.firstElementChild?.className).toMatch(/_default_/);
  });

  it('invokes onClick on activation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<TextLink onClick={onClick}>Toggle</TextLink>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
