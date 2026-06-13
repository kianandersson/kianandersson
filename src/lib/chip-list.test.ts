import { describe, expect, it } from 'vitest';
import { sliceList } from './chip-list';

describe('sliceList', () => {
  describe('when the list fits within the limit', () => {
    it('returns every item as visible and none as hidden', () => {
      const { visible, hidden } = sliceList(['a', 'b', 'c'], 5);
      expect(visible).toEqual(['a', 'b', 'c']);
      expect(hidden).toEqual([]);
    });

    it('reports no overflow', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c'], 5);
      expect(hasMore).toBe(false);
      expect(hiddenCount).toBe(0);
    });
  });

  describe('when the list exceeds the limit', () => {
    it('partitions items at the limit boundary', () => {
      const { visible, hidden } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4);
      expect(visible).toEqual(['a', 'b', 'c', 'd']);
      expect(hidden).toEqual(['e', 'f']);
    });

    it('reports the overflow count', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4);
      expect(hasMore).toBe(true);
      expect(hiddenCount).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('handles an empty list', () => {
      expect(sliceList<string>([], 4)).toEqual({
        visible: [],
        hidden: [],
        hasMore: false,
        hiddenCount: 0,
      });
    });

    it('handles a list of exactly `limit` items', () => {
      const { visible, hidden, hasMore, hiddenCount } = sliceList(['a', 'b', 'c', 'd'], 4);
      expect(visible).toEqual(['a', 'b', 'c', 'd']);
      expect(hidden).toEqual([]);
      expect(hasMore).toBe(false);
      expect(hiddenCount).toBe(0);
    });

    it('does not mutate the input array', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      sliceList(items, 2);
      expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
  });
});
