import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats as "dd.mm.yyyy" with zero-padded day and month', () => {
    expect(formatDate(new Date('2026-09-01T00:00:00Z'))).toBe('01.09.2026');
    expect(formatDate(new Date('2026-12-31T00:00:00Z'))).toBe('31.12.2026');
  });
});
