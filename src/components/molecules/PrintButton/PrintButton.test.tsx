import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrintButton } from './PrintButton';

describe('PrintButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a labelled print button', () => {
    render(<PrintButton />);
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
  });

  it('invokes window.print when clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<PrintButton />);
    await user.click(screen.getByRole('button'));
    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
