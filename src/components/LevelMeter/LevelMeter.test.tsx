import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LevelMeter } from './LevelMeter';

describe('LevelMeter', () => {
  it('lights up "on" markers equal to level out of 5', () => {
    const { container } = render(<LevelMeter level={3} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(3);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(2);
  });

  it('lights up all 5 markers at level 5', () => {
    const { container } = render(<LevelMeter level={5} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(5);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(0);
  });

  it('lights up only 1 marker at level 1', () => {
    const { container } = render(<LevelMeter level={1} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(1);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(4);
  });

  it('hides from assistive tech as decorative — the row label carries the level', () => {
    const { container } = render(<LevelMeter level={3} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
