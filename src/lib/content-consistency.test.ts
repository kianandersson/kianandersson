import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

type SkillType = 'stack' | 'method';

type SkillItem = {
  name: string;
  type: SkillType;
  level?: number;
  years?: number;
  lastUsed?: number;
  covers?: string[];
  hide?: boolean;
};

type SkillGroup = {
  name: string;
  skills: SkillItem[];
};

type SkillsFile = {
  featured: string[];
  groups: SkillGroup[];
};

type ExperienceFile = {
  role: string;
  meta: string;
  description: string;
  stack: string[];
  methods: string[];
};

const REPO_ROOT = process.cwd();
const SKILLS_PATH = join(REPO_ROOT, 'src/content/skills.yaml');
const EXPERIENCE_DIR = join(REPO_ROOT, 'src/content/experience');

function loadSkills(): SkillsFile {
  return yaml.load(readFileSync(SKILLS_PATH, 'utf-8')) as SkillsFile;
}

function flattenSkills(skills: SkillsFile): (SkillItem & { group: string })[] {
  return skills.groups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.name })));
}

function loadExperience(): ExperienceFile[] {
  return readdirSync(EXPERIENCE_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => yaml.load(readFileSync(join(EXPERIENCE_DIR, file), 'utf-8')) as ExperienceFile);
}

describe('skills.yaml internal consistency', () => {
  const skills = loadSkills();
  const allItems = flattenSkills(skills);
  const visibleItems = allItems.filter((item) => !item.hide);

  it('group names are unique', () => {
    const counts = new Map<string, number>();
    for (const group of skills.groups) {
      counts.set(group.name, (counts.get(group.name) ?? 0) + 1);
    }
    for (const [name, count] of counts) {
      expect(count, `Group "${name}" appears ${count} times`).toBe(1);
    }
  });

  it('every group has at least one visible skill', () => {
    for (const group of skills.groups) {
      const visibleInGroup = group.skills.filter((s) => !s.hide);
      expect(
        visibleInGroup.length > 0,
        `Group "${group.name}" has no visible skills — remove the group or add a skill`,
      ).toBe(true);
    }
  });

  it('skill names are unique (visible + hidden)', () => {
    const counts = new Map<string, number>();
    for (const item of allItems) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + 1);
    }
    for (const [name, count] of counts) {
      expect(count, `Skill "${name}" appears ${count} times`).toBe(1);
    }
  });

  it('every covered name resolves to a single type', () => {
    // A name may appear as a top-level skill AND in one or more parents'
    // covers arrays. That's how multi-parent / cross-type relationships work.
    // The rule we still enforce: if a name appears only in covers (no
    // top-level entry), all parents listing it must share the same type —
    // otherwise the type is ambiguous.
    const topLevelType = new Map<string, SkillType>(allItems.map((s) => [s.name, s.type]));
    const coverParents = new Map<string, SkillType[]>();
    for (const item of allItems) {
      if (!item.covers) continue;
      for (const covered of item.covers) {
        const list = coverParents.get(covered) ?? [];
        list.push(item.type);
        coverParents.set(covered, list);
      }
    }
    for (const [covered, parentTypes] of coverParents) {
      if (topLevelType.has(covered)) continue; // top-level wins, no ambiguity
      const unique = new Set(parentTypes);
      expect(
        unique.size === 1,
        `"${covered}" is covered by parents of mixed types (${[...unique].join(', ')}) and has no top-level entry — add a top-level skill to disambiguate`,
      ).toBe(true);
    }
  });

  it('visible items have a plausible lastUsed given years (>= 2000)', () => {
    for (const item of visibleItems) {
      const startYear = (item.lastUsed as number) - (item.years as number);
      expect(
        startYear >= 2000,
        `Skill "${item.name}" implies a start year of ${startYear} (lastUsed ${item.lastUsed} - years ${item.years}) — likely a typo`,
      ).toBe(true);
    }
  });

  it('every featured name matches a visible top-level skill', () => {
    const visibleNames = new Set(visibleItems.map((s) => s.name));
    for (const name of skills.featured) {
      expect(
        visibleNames.has(name),
        `featured entry "${name}" doesn't match any visible skill in groups`,
      ).toBe(true);
    }
  });

  it('every item has a type of "stack" or "method"', () => {
    for (const item of allItems) {
      expect(
        item.type === 'stack' || item.type === 'method',
        `Skill "${item.name}" has invalid type "${item.type}" — must be "stack" or "method"`,
      ).toBe(true);
    }
  });

  it('featured entries are unique', () => {
    const counts = new Map<string, number>();
    for (const name of skills.featured) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    for (const [name, count] of counts) {
      expect(count, `featured includes "${name}" ${count} times`).toBe(1);
    }
  });
});

describe('experience vs skills consistency', () => {
  const skills = loadSkills();
  const allItems = flattenSkills(skills);
  const experience = loadExperience();

  // Effective type per referenceable name. Top-level entries win over cover
  // inheritance, which is what enables cross-type relationships (e.g. a
  // `stack` skill can be covered by a `method`-typed parent without losing
  // its own type when referenced from experience.stack).
  const nameType = (() => {
    const map = new Map<string, SkillType>();
    for (const item of allItems) map.set(item.name, item.type);
    for (const item of allItems) {
      if (!item.covers) continue;
      for (const c of item.covers) {
        if (!map.has(c)) map.set(c, item.type);
      }
    }
    return map;
  })();

  function check(field: 'stack' | 'methods', expectedType: SkillType) {
    for (const role of experience) {
      for (const name of role[field]) {
        const actualType = nameType.get(name);
        expect(
          actualType !== undefined,
          `"${role.role} @ ${role.meta}" ${field} includes "${name}" — not a skill, cover, or hidden historical entry. ` +
            `Either rename it to match skills.yaml, mark it covered under a paraply, or add it to skills.yaml with hide: true.`,
        ).toBe(true);
        expect(
          actualType,
          `"${role.role} @ ${role.meta}" lists "${name}" under ${field}, but it is typed as "${actualType}" in skills.yaml. ` +
            `Either move it to the other field, or fix the type in skills.yaml.`,
        ).toBe(expectedType);
      }
    }
  }

  it('every stack item matches a skill or cover of type "stack"', () => {
    check('stack', 'stack');
  });

  it('every methods item matches a skill or cover of type "method"', () => {
    check('methods', 'method');
  });
});
