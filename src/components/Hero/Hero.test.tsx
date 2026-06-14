import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

const baseProps = {
  name: 'Kian',
  ctaHref: 'mailto:test@example.com',
};

const PAST = new Date(Date.now() - 24 * 60 * 60 * 1000);
const FUTURE = new Date('2099-09-01T00:00:00Z');

describe('Hero', () => {
  it('greets by name in the heading', () => {
    render(<Hero {...baseProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hi, I'm Kian.");
  });

  it('shows immediate availability badge when availableFrom is in the past', () => {
    render(<Hero {...baseProps} availableFrom={PAST} />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('shows future start date when availableFrom is in the future', () => {
    const { container } = render(<Hero {...baseProps} availableFrom={FUTURE} />);
    expect(container.textContent).toContain('Available from 01.09.2099');
  });

  it('hides availability badge when availableFrom is undefined', () => {
    render(<Hero {...baseProps} />);
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
  });

  it('links the CTA to the provided href', () => {
    render(<Hero {...baseProps} ctaHref="mailto:foo@bar.com" />);
    const cta = screen.getByRole('link', { name: /get in touch/i });
    expect(cta).toHaveAttribute('href', 'mailto:foo@bar.com');
  });
});
