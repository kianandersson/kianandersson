import { describe, expect, it } from 'vitest';
import { sortSkills } from './sort-skills';

type Item = { name: string; level: number; years: number };

describe('sortSkills', () => {
  it('returns an empty list when given no items', () => {
    expect(sortSkills<Item>([])).toEqual([]);
  });

  it('sorts by level descending first', () => {
    const items: Item[] = [
      { name: 'a', level: 3, years: 5 },
      { name: 'b', level: 5, years: 1 },
      { name: 'c', level: 4, years: 10 },
    ];
    expect(sortSkills(items).map((i) => i.name)).toEqual(['b', 'c', 'a']);
  });

  it('breaks level ties by years descending', () => {
    const items: Item[] = [
      { name: 'a', level: 4, years: 2 },
      { name: 'b', level: 4, years: 9 },
      { name: 'c', level: 4, years: 5 },
    ];
    expect(sortSkills(items).map((i) => i.name)).toEqual(['b', 'c', 'a']);
  });

  it('breaks level and year ties alphabetically by name', () => {
    const items: Item[] = [
      { name: 'Zebra', level: 4, years: 5 },
      { name: 'Apple', level: 4, years: 5 },
      { name: 'Mango', level: 4, years: 5 },
    ];
    expect(sortSkills(items).map((i) => i.name)).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('does not mutate the input array', () => {
    const items: Item[] = [
      { name: 'a', level: 3, years: 5 },
      { name: 'b', level: 5, years: 1 },
    ];
    const original = [...items];
    sortSkills(items);
    expect(items).toEqual(original);
  });
});
