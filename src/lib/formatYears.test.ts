import { describe, expect, it } from 'vitest';
import { formatYears } from './formatYears';

describe('formatYears', () => {
  it('uses singular yr for exactly 1 year', () => {
    expect(formatYears(1)).toBe('+1 yr');
  });

  it('uses plural yrs for more than 1 year', () => {
    expect(formatYears(2)).toBe('+2 yrs');
    expect(formatYears(8)).toBe('+8 yrs');
  });

  it('uses plural yrs for zero years', () => {
    expect(formatYears(0)).toBe('+0 yrs');
  });
});
