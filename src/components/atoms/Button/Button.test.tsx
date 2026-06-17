import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a button element by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders an anchor when href is provided', () => {
    render(<Button href="/path">Go</Button>);
    const link = screen.getByRole('link', { name: /go/i });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/path');
  });

  it('auto-injects safe rel when target is _blank without an explicit rel', () => {
    render(
      <Button href="https://example.com" target="_blank">
        External
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('preserves an explicit rel value', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="me">
        External
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'me');
  });

  it('invokes onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Tap</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects type=submit', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards disabled to the button', () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
