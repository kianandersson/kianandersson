import { describe, expect, it } from 'vitest';
import { sliceList } from './chip-list';

describe('sliceList', () => {
  describe('when the list fits within the limit', () => {
    it('returns every item visible', () => {
      const { visible } = sliceList(['a', 'b', 'c'], 5, false);
      expect(visible).toEqual(['a', 'b', 'c']);
    });

    it('reports no more items to reveal', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c'], 5, false);
      expect(hasMore).toBe(false);
      expect(hiddenCount).toBe(0);
    });
  });

  describe('when the list exceeds the limit and is collapsed', () => {
    it('returns only the first `limit` items visible', () => {
      const { visible } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4, false);
      expect(visible).toEqual(['a', 'b', 'c', 'd']);
    });

    it('reports the remaining items as hidden', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4, false);
      expect(hasMore).toBe(true);
      expect(hiddenCount).toBe(2);
    });
  });

  describe('when the list exceeds the limit and is open', () => {
    it('returns every item visible', () => {
      const { visible } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4, true);
      expect(visible).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('still reports that the list can collapse', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c', 'd', 'e', 'f'], 4, true);
      expect(hasMore).toBe(true);
      expect(hiddenCount).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('handles an empty list', () => {
      expect(sliceList<string>([], 4, false)).toEqual({
        visible: [],
        hasMore: false,
        hiddenCount: 0,
      });
    });

    it('handles a list of exactly `limit` items', () => {
      const { visible, hasMore, hiddenCount } = sliceList(['a', 'b', 'c', 'd'], 4, false);
      expect(visible).toEqual(['a', 'b', 'c', 'd']);
      expect(hasMore).toBe(false);
      expect(hiddenCount).toBe(0);
    });

    it('does not mutate the input array', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      sliceList(items, 2, false);
      expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
  });
});
