import { describe, expect, it } from 'vitest';
import { resolveKeySkills } from './resolve-key-skills';

type Skill = { name: string; level: number };

const skillByName = new Map<string, Skill>([
  ['React.js', { name: 'React.js', level: 5 }],
  ['GraphQL', { name: 'GraphQL', level: 4 }],
  ['TypeScript', { name: 'TypeScript', level: 5 }],
]);

describe('resolveKeySkills', () => {
  it('resolves each name to its skill, in the given order', () => {
    expect(resolveKeySkills(['GraphQL', 'React.js'], skillByName)).toEqual([
      { name: 'GraphQL', level: 4 },
      { name: 'React.js', level: 5 },
    ]);
  });

  it('resolves an empty list to an empty result (the section hides)', () => {
    expect(resolveKeySkills([], skillByName)).toEqual([]);
  });

  it('throws on a name that matches no visible skill', () => {
    expect(() => resolveKeySkills(['React.js', 'Reactjs'], skillByName)).toThrow(
      /Key skill "Reactjs" matches no visible skill/,
    );
  });
});
