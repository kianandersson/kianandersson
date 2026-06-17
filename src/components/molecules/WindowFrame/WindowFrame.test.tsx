import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { WindowFrame } from './WindowFrame';

describe('WindowFrame', () => {
  it('renders a div containing the children', () => {
    const { container } = render(<WindowFrame>content</WindowFrame>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders an optional title beside the traffic lights', () => {
    render(<WindowFrame title="zsh">body</WindowFrame>);
    expect(screen.getByText('zsh')).toBeInTheDocument();
  });

  it('hides the decorative traffic lights from assistive tech', () => {
    const { container } = render(<WindowFrame>body</WindowFrame>);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('merges a caller-provided class onto the root', () => {
    const { container } = render(<WindowFrame class="custom">body</WindowFrame>);
    expect(container.firstElementChild?.className).toMatch(/custom/);
  });
});
