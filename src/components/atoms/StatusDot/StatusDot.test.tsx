import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<StatusDot />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes the tone via a data attribute', () => {
    const { container, rerender } = render(<StatusDot />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'success');

    rerender(<StatusDot tone="warning" />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'warning');
  });
});
