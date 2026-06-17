import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { formatDate } from '../../../lib/formatDate';
import { AvailabilityStatus } from './AvailabilityStatus';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PAST = new Date(Date.now() - ONE_DAY_MS);
const FUTURE = new Date(Date.now() + 30 * ONE_DAY_MS);

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
    expect(getByText(formatDate(FUTURE))).toBeInTheDocument();
    expect(container.querySelector('[data-tone="warning"]')).not.toBeNull();
    expect(container.firstChild).toHaveAttribute('data-state', 'future');
  });
});
