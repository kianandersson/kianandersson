import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats as "D Month" with the English month name and no zero-padded day', () => {
    expect(formatDate(new Date('2026-09-01T00:00:00Z'))).toBe('1 September');
    expect(formatDate(new Date('2026-12-31T00:00:00Z'))).toBe('31 December');
  });
});
