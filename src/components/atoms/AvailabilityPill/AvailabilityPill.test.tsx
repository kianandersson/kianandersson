import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityPill } from './AvailabilityPill';

const PAST = new Date('2000-01-01T00:00:00Z');
const FUTURE = new Date('2099-09-01T00:00:00Z');

describe('AvailabilityPill', () => {
  it('renders the "available now" state with a success-toned dot for a past date', () => {
    const { container, getByText } = render(<AvailabilityPill availableFrom={PAST} />);
    expect(getByText('Available for work')).toBeInTheDocument();
    expect(container.querySelector('[data-tone="success"]')).not.toBeNull();
    expect(container.firstChild).toHaveAttribute('data-state', 'available');
  });

  it('renders the "future" state with a warning-toned dot and formatted start date', () => {
    const { container, getByText } = render(<AvailabilityPill availableFrom={FUTURE} />);
    expect(getByText(/Available from/i)).toBeInTheDocument();
    expect(getByText('1 Sep')).toBeInTheDocument();
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
    expect(container.firstChild).toHaveAttribute('data-state', 'future');
  });
});
