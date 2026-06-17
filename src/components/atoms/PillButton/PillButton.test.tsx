import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PillButton } from './PillButton';

describe('PillButton', () => {
  it('renders the label inside a button by default', () => {
    render(<PillButton>Send message</PillButton>);
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('exposes the size on a data attribute', () => {
    const { container, rerender } = render(<PillButton>Send</PillButton>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');

    rerender(<PillButton size="md">Send</PillButton>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
  });

  it('respects type=submit for use inside forms', () => {
    render(<PillButton type="submit">Send</PillButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards disabled state', () => {
    render(<PillButton disabled>Send</PillButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not invoke onClick when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <PillButton disabled onClick={onClick}>
        Send
      </PillButton>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
