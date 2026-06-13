import { describe, expect, it } from 'vitest';
import { dotArray, levelLabel } from './skill';

describe('levelLabel', () => {
  it('returns "Knowledge" for level 1', () => {
    expect(levelLabel(1)).toBe('Knowledge');
  });

  it('returns "Good knowledge" for level 2', () => {
    expect(levelLabel(2)).toBe('Good knowledge');
  });

  it('returns "Experienced" for level 3', () => {
    expect(levelLabel(3)).toBe('Experienced');
  });

  it('returns "Very experienced" for level 4', () => {
    expect(levelLabel(4)).toBe('Very experienced');
  });

  it('returns "Expert" for level 5', () => {
    expect(levelLabel(5)).toBe('Expert');
  });
});

describe('dotArray', () => {
  it('returns 1 on and 4 off for level 1', () => {
    expect(dotArray(1)).toEqual({ on: 1, off: 4 });
  });

  it('returns 3 on and 2 off for level 3', () => {
    expect(dotArray(3)).toEqual({ on: 3, off: 2 });
  });

  it('returns 5 on and 0 off for level 5', () => {
    expect(dotArray(5)).toEqual({ on: 5, off: 0 });
  });

  it('always sums on + off to 5', () => {
    for (const level of [1, 2, 3, 4, 5] as const) {
      const { on, off } = dotArray(level);
      expect(on + off).toBe(5);
    }
  });
});
