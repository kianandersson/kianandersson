import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('exposes the aria-label as the accessible name', () => {
    render(
      <IconButton aria-label="Print">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
  });

  it('hides the icon from assistive tech', () => {
    const { container } = render(
      <IconButton aria-label="Print">
        <svg data-testid="icon" />
      </IconButton>,
    );
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).not.toBeNull();
  });

  it('invokes onClick on activation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton aria-label="Print" onClick={onClick}>
        <svg />
      </IconButton>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as an anchor when href is supplied', () => {
    render(
      <IconButton aria-label="GitHub" href="https://github.com">
        <svg />
      </IconButton>,
    );
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toHaveAttribute('href', 'https://github.com');
  });
});
