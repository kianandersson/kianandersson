import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<StatusDot />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('opts into the pulse animation only when requested', () => {
    const { container, rerender } = render(<StatusDot />);
    expect(container.firstElementChild).not.toHaveAttribute('data-pulse');

    rerender(<StatusDot pulse />);
    expect(container.firstElementChild).toHaveAttribute('data-pulse');
  });
});
