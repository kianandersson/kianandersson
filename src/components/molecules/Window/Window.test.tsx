import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Window } from './Window';

describe('Window', () => {
  it('renders a div containing the children', () => {
    const { container } = render(<Window>content</Window>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders an optional title beside the traffic lights', () => {
    render(<Window title="zsh">body</Window>);
    expect(screen.getByText('zsh')).toBeInTheDocument();
  });

  it('hides the decorative traffic lights from assistive tech', () => {
    const { container } = render(<Window>body</Window>);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('merges a caller-provided class onto the root', () => {
    const { container } = render(<Window class="custom">body</Window>);
    expect(container.firstElementChild?.className).toMatch(/custom/);
  });
});
