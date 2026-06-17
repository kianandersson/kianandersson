import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { TimelineMarker } from './TimelineMarker';

describe('TimelineMarker', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<TimelineMarker />);
    const marker = container.firstElementChild;
    expect(marker).not.toBeNull();
    expect(marker).toHaveAttribute('aria-hidden', 'true');
  });
});
