import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityPill } from './AvailabilityPill';

const PAST = new Date(Date.now() - 24 * 60 * 60 * 1000);
const FUTURE = new Date('2099-09-01T00:00:00Z');

describe('AvailabilityPill', () => {
  it('renders nothing when no date is provided', () => {
    const { container } = render(<AvailabilityPill />);
    expect(container).toBeEmptyDOMElement();
  });

  it('states immediate availability when the date is in the past', () => {
    render(<AvailabilityPill availableFrom={PAST} />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
  });

  it('announces a future start date when the date is in the future', () => {
    const { container } = render(<AvailabilityPill availableFrom={FUTURE} />);
    expect(container.textContent).toContain('Available from 01.09.2099');
  });
});
