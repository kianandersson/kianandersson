import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats as "D Mon" with the short English month name and no zero-padded day', () => {
    expect(formatDate(new Date('2026-09-01T00:00:00Z'))).toBe('1 Sep');
    expect(formatDate(new Date('2026-12-31T00:00:00Z'))).toBe('31 Dec');
  });
});
