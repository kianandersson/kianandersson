import { describe, expect, it } from 'vitest';
import { formatPeriod } from './formatPeriod';

describe('formatPeriod', () => {
  it('formats start + end as "Mon YYYY — Mon YYYY"', () => {
    expect(formatPeriod(new Date('2021-06-01'), new Date('2023-02-28'))).toBe(
      'Jun 2021 — Feb 2023',
    );
    expect(formatPeriod(new Date('2019-08-01'), new Date('2021-05-31'))).toBe(
      'Aug 2019 — May 2021',
    );
  });

  it('marks the period as "Present" when end is omitted', () => {
    expect(formatPeriod(new Date('2023-03-01'))).toBe('Mar 2023 — Present');
  });

  it('uses an em dash to separate the two endpoints', () => {
    expect(formatPeriod(new Date('2023-03-01'))).toContain(' — ');
  });

  it('accepts month-precision dates (YYYY-MM) alongside full dates', () => {
    expect(formatPeriod(new Date('2021-06'), new Date('2023-02'))).toBe('Jun 2021 — Feb 2023');
    expect(formatPeriod(new Date('2023-03'))).toBe('Mar 2023 — Present');
  });
});
