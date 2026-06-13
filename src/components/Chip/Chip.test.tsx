import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders the given label', () => {
    render(<Chip label="TypeScript" variant="stack" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('exposes the variant for downstream styling and querying', () => {
    render(<Chip label="Pair programming" variant="methods" />);
    const chip = screen.getByText('Pair programming');
    expect(chip).toHaveAttribute('data-variant', 'methods');
  });
});
