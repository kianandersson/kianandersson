import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityPill } from './AvailabilityPill';

describe('AvailabilityPill', () => {
  it('states immediate availability by default', () => {
    render(<AvailabilityPill />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('announces a future start date when `from` is provided', () => {
    const { container } = render(<AvailabilityPill from={new Date('2026-09-01T00:00:00Z')} />);
    expect(container.textContent).toContain('Available from 01.09.2026');
  });
});
