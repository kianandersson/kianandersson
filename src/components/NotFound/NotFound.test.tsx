import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('announces the page with an h1', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "This page couldn't be found.",
    );
  });

  it('links the CTA back to the home page', () => {
    render(<NotFound />);
    const cta = screen.getByRole('link', { name: /back to home/i });
    expect(cta).toHaveAttribute('href', '/');
  });

  it('shows a default placeholder path in the terminal mock', () => {
    render(<NotFound />);
    expect(screen.getByTestId('requested-path')).toHaveTextContent('/that-page');
  });

  it('renders the path passed in as the requested path', () => {
    render(<NotFound requestedPath="/missing" />);
    expect(screen.getByTestId('requested-path')).toHaveTextContent('/missing');
  });

  it('shows the curl response lines', () => {
    render(<NotFound />);
    expect(screen.getByText(/HTTP\/2/)).toBeInTheDocument();
    expect(screen.getByText(/x-route-matched: none/)).toBeInTheDocument();
  });
});
