import { describe, expect, it } from 'vitest';
import { sliceList } from './chip-list';

describe('sliceList', () => {
  describe('when the list fits within the character budget', () => {
    it('returns every item as visible and none as hidden', () => {
      const { visible, hidden } = sliceList(['a', 'b', 'c'], { maxChars: 50 });
      expect(visible).toEqual(['a', 'b', 'c']);
      expect(hidden).toEqual([]);
    });

    it('reports no overflow', () => {
      const { hasMore, hiddenCount } = sliceList(['a', 'b', 'c'], { maxChars: 50 });
      expect(hasMore).toBe(false);
      expect(hiddenCount).toBe(0);
    });
  });

  describe('when the list exceeds the character budget', () => {
    it('stops before the running total would cross the budget', () => {
      const items = ['React', 'Preact', 'Astro', 'TypeScript'];
      // React(5) + Preact(6) = 11, +Astro(5) = 16, +TypeScript(10) = 26.
      const { visible, hidden } = sliceList(items, { maxChars: 20 });
      expect(visible).toEqual(['React', 'Preact', 'Astro']);
      expect(hidden).toEqual(['TypeScript']);
    });

    it('reports the overflow count', () => {
      const { hasMore, hiddenCount } = sliceList(['React', 'Preact', 'Astro', 'TypeScript'], {
        maxChars: 20,
      });
      expect(hasMore).toBe(true);
      expect(hiddenCount).toBe(1);
    });

    it('adapts the visible count to item length so short and long lists fill similar widths', () => {
      const shortItems = ['PHP', 'SQL', 'Auth0', 'Docker', 'Redis', 'Apigee', 'Kong'];
      const longItems = ['Software Architecture', 'API Design', 'Authentication'];
      const short = sliceList(shortItems, { maxChars: 30 });
      const long = sliceList(longItems, { maxChars: 30 });

      expect(short.visible.length).toBeGreaterThan(long.visible.length);
      expect(short.visible.join('').length).toBeLessThanOrEqual(30);
      expect(long.visible.join('').length).toBeLessThanOrEqual(30 + longItems[0].length);
    });
  });

  describe('perItemCost', () => {
    it('charges every item a fixed overhead in addition to its length', () => {
      // Budget 20, perItemCost 5 → each item costs len+5.
      // 'aa'(2+5=7) total=7, 'bbb'(3+5=8) total=15, 'ccc'(3+5=8) total=23 >20 → stop.
      const { visible } = sliceList(['aa', 'bbb', 'ccc', 'd'], { maxChars: 20, perItemCost: 5 });
      expect(visible).toEqual(['aa', 'bbb']);
    });
  });

  describe('minItems', () => {
    it('shows at least minItems even when the first items already exceed the budget', () => {
      const items = ['Engineering Management', 'Software Architecture', 'Continuous Delivery'];
      const { visible, hidden } = sliceList(items, { maxChars: 10, minItems: 2 });
      expect(visible).toEqual(['Engineering Management', 'Software Architecture']);
      expect(hidden).toEqual(['Continuous Delivery']);
    });

    it('does not pad beyond the available items', () => {
      const { visible, hasMore } = sliceList(['only'], { maxChars: 1, minItems: 5 });
      expect(visible).toEqual(['only']);
      expect(hasMore).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles an empty list', () => {
      expect(sliceList([], { maxChars: 50 })).toEqual({
        visible: [],
        hidden: [],
        hasMore: false,
        hiddenCount: 0,
      });
    });

    it('does not mutate the input array', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      sliceList(items, { maxChars: 2 });
      expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
  });
});
