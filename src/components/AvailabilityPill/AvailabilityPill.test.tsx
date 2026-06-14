import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityPill } from './AvailabilityPill';

describe('AvailabilityPill', () => {
  it('renders the live "available" variant', () => {
    render(<AvailabilityPill variant="available" />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('renders the "from" variant with a formatted date', () => {
    const { container } = render(
      <AvailabilityPill variant="from" from={new Date('2026-09-01T00:00:00Z')} />,
    );
    expect(container.textContent).toContain('Available from 01.09.2026');
  });
});
