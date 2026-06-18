import { describe, expect, it } from 'vitest';
import { sortGroups } from './sort-groups';

type Item = { group: string };

describe('sortGroups', () => {
  it('returns an empty list when given no groups', () => {
    expect(sortGroups<Item>([], ['A', 'B'])).toEqual([]);
  });

  it('orders groups according to the provided order', () => {
    const groups: Item[] = [{ group: 'C' }, { group: 'A' }, { group: 'B' }];
    expect(sortGroups(groups, ['A', 'B', 'C']).map((g) => g.group)).toEqual(['A', 'B', 'C']);
  });

  it('puts groups not in the order at the end, preserving their relative order', () => {
    const groups: Item[] = [
      { group: 'X' },
      { group: 'A' },
      { group: 'Y' },
      { group: 'B' },
    ];
    expect(sortGroups(groups, ['A', 'B']).map((g) => g.group)).toEqual(['A', 'B', 'X', 'Y']);
  });

  it('does not mutate the input array', () => {
    const groups: Item[] = [{ group: 'C' }, { group: 'A' }];
    const original = [...groups];
    sortGroups(groups, ['A', 'C']);
    expect(groups).toEqual(original);
  });
});
