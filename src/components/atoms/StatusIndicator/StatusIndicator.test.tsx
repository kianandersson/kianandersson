import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { StatusIndicator } from './StatusIndicator';

describe('StatusIndicator', () => {
  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<StatusIndicator />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes the tone via a data attribute', () => {
    const { container, rerender } = render(<StatusIndicator />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'success');

    rerender(<StatusIndicator tone="warning" />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'warning');
  });
});
