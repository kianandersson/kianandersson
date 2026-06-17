import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { AvailabilityStatus } from './AvailabilityStatus';

const PAST = new Date('2000-01-01T00:00:00Z');
const FUTURE = new Date('2099-09-01T00:00:00Z');

describe('AvailabilityStatus', () => {
  it('renders the "available now" state with a success-toned indicator for a past date', () => {
    const { container, getByText } = render(<AvailabilityStatus availableFrom={PAST} />);
    expect(getByText('Available for work')).toBeInTheDocument();
    expect(container.querySelector('[data-tone="success"]')).not.toBeNull();
    expect(container.firstChild).toHaveAttribute('data-state', 'available');
  });

  it('renders the "future" state with a warning-toned indicator and formatted start date', () => {
    const { container, getByText } = render(<AvailabilityStatus availableFrom={FUTURE} />);
    expect(getByText(/Available from/i)).toBeInTheDocument();
    expect(getByText('1 Sep')).toBeInTheDocument();
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
    expect(container.firstChild).toHaveAttribute('data-state', 'future');
  });
});
