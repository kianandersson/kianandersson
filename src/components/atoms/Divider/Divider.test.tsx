import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders an hr element', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).not.toBeNull();
  });

  it('exposes the implicit ARIA separator role to assistive tech', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).not.toHaveAttribute('aria-hidden');
  });
});
