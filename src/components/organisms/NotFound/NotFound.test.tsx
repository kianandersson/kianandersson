import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('announces the page with an h1', () => {
    render(<NotFound homeHref="/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "This page couldn't be found.",
    );
  });

  it('links the CTA back to the home page', () => {
    render(<NotFound homeHref="/" />);
    const cta = screen.getByRole('link', { name: /back to home/i });
    expect(cta).toHaveAttribute('href', '/');
  });

  it('shows a default placeholder url in the terminal mock', () => {
    render(<NotFound homeHref="/" />);
    expect(screen.getByTestId('requested-url')).toHaveTextContent('/');
  });

  it('renders the url passed in as the requested url', () => {
    render(<NotFound homeHref="/" requestedUrl="/missing" />);
    expect(screen.getByTestId('requested-url')).toHaveTextContent('/missing');
  });

  it('shows the curl response lines', () => {
    render(<NotFound homeHref="/" />);
    expect(screen.getByText(/HTTP\/2 404 Not Found/)).toBeInTheDocument();
    expect(screen.getByText(/content-type:/)).toBeInTheDocument();
  });
});
