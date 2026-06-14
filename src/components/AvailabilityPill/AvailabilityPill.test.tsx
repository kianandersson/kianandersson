import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityPill } from './AvailabilityPill';

describe('AvailabilityPill', () => {
  it('states availability', () => {
    render(<AvailabilityPill />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });
});
