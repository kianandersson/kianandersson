import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

const baseProps = {
  name: 'Kian',
  available: true,
  ctaHref: 'mailto:test@example.com',
};

describe('Hero', () => {
  it('greets by name in the heading', () => {
    render(<Hero {...baseProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Kian.");
  });

  it('shows availability badge when available', () => {
    render(<Hero {...baseProps} available={true} />);
    expect(screen.getByText(/Available for new projects/i)).toBeInTheDocument();
  });

  it('hides availability badge when not available', () => {
    render(<Hero {...baseProps} available={false} />);
    expect(screen.queryByText(/Available for new projects/i)).not.toBeInTheDocument();
  });

  it('links the CTA to the provided href', () => {
    render(<Hero {...baseProps} ctaHref="mailto:foo@bar.com" />);
    const cta = screen.getByRole('link', { name: /get in touch/i });
    expect(cta).toHaveAttribute('href', 'mailto:foo@bar.com');
  });
});
