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

  it('shows <1 yrs for zero years', () => {
    expect(formatYears(0)).toBe('<1 yrs');
  });

  it('uses "år" in Danish, which is the same in singular and plural', () => {
    expect(formatYears(1, 'da')).toBe('+1 år');
    expect(formatYears(8, 'da')).toBe('+8 år');
    expect(formatYears(0, 'da')).toBe('<1 år');
  });
});
