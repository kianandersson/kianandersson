import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { CtaButton } from './CtaButton';

describe('CtaButton', () => {
  it('renders a link with the given href and label', () => {
    render(<CtaButton href="/somewhere">Go there</CtaButton>);
    const link = screen.getByRole('link', { name: /go there/i });
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('places the arrow after the label by default (forward)', () => {
    render(<CtaButton href="/">Forward</CtaButton>);
    const link = screen.getByRole('link');
    const arrow = link.querySelector('[data-cta-arrow]');
    expect(arrow).not.toBeNull();
    expect(link.lastElementChild).toBe(arrow);
  });

  it('places the arrow before the label when direction is "back"', () => {
    render(
      <CtaButton href="/" direction="back">
        Back home
      </CtaButton>,
    );
    const link = screen.getByRole('link');
    const arrow = link.querySelector('[data-cta-arrow]');
    expect(arrow).not.toBeNull();
    expect(link.firstElementChild).toBe(arrow);
  });
});
