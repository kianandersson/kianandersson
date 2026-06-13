import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DotRating } from './DotRating';

describe('DotRating', () => {
  it('lights up "on" dots equal to level out of 5', () => {
    const { container } = render(<DotRating level={3} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(3);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(2);
  });

  it('lights up all 5 dots at level 5', () => {
    const { container } = render(<DotRating level={5} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(5);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(0);
  });

  it('lights up only 1 dot at level 1', () => {
    const { container } = render(<DotRating level={1} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(1);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(4);
  });

  it('hides from assistive tech as decorative — the row label carries the level', () => {
    const { container } = render(<DotRating level={3} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
