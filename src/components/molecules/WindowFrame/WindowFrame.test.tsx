import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { WindowFrame } from './WindowFrame';

describe('WindowFrame', () => {
  it('renders as a div by default', () => {
    const { container } = render(<WindowFrame>content</WindowFrame>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('renders as a form when as="form" and forwards aria-label + onSubmit', () => {
    const { container } = render(
      <WindowFrame as="form" aria-label="Contact" noValidate>
        body
      </WindowFrame>,
    );
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute('aria-label', 'Contact');
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
});
