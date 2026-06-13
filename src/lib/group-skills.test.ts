import { describe, expect, it } from 'vitest';
import { groupSkills } from './group-skills';

type Item = { id: string; group: string };

describe('groupSkills', () => {
  it('returns an empty list when given no items', () => {
    expect(groupSkills<Item>([])).toEqual([]);
  });

  it('groups items by their group field', () => {
    const items: Item[] = [
      { id: 'ts', group: 'Languages' },
      { id: 'react', group: 'Frameworks' },
      { id: 'js', group: 'Languages' },
    ];
    expect(groupSkills(items)).toEqual([
      { group: 'Languages', items: [items[0], items[2]] },
      { group: 'Frameworks', items: [items[1]] },
    ]);
  });

  it('preserves first-seen order of groups', () => {
    const items: Item[] = [
      { id: 'a', group: 'Z' },
      { id: 'b', group: 'A' },
      { id: 'c', group: 'M' },
    ];
    expect(groupSkills(items).map((g) => g.group)).toEqual(['Z', 'A', 'M']);
  });

  it('preserves the original order of items within each group', () => {
    const items: Item[] = [
      { id: 'a', group: 'X' },
      { id: 'b', group: 'X' },
      { id: 'c', group: 'X' },
    ];
    expect(groupSkills(items)[0].items.map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });
});
