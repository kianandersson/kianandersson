import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

type SkillCategory = 'technology' | 'concept' | 'practice' | 'organizational';

type SkillItem = {
  name: string;
  category: SkillCategory;
  level?: number;
  years?: number;
  lastUsed?: number;
  children?: string[];
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
  technologies: string[];
  concepts?: string[];
  practices?: string[];
  organizational?: string[];
};

const REPO_ROOT = process.cwd();
const SKILLS_PATH = join(REPO_ROOT, 'src/content/skills.yaml');
const EXPERIENCE_DIR = join(REPO_ROOT, 'src/content/experience');

// Experience descriptions are kept short and scannable. Anything longer reads
// as a wall of text on the rendered CV. Keep this in sync with the editorial rule.
const MAX_DESCRIPTION_LENGTH = 1000;

function loadExperienceFiles(): { file: string; data: ExperienceFile }[] {
  return readdirSync(EXPERIENCE_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => ({
      file,
      data: yaml.load(readFileSync(join(EXPERIENCE_DIR, file), 'utf-8')) as ExperienceFile,
    }));
}

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

  it('every child resolves to a single type', () => {
    // A name may appear as a top-level skill AND in one or more parents'
    // children arrays. That's how multi-parent / cross-type relationships work.
    // The rule we still enforce: if a name appears only as a child (no
    // top-level entry), all parents listing it must share the same type —
    // otherwise the type is ambiguous.
    const topLevelCategory = new Map<string, SkillCategory>(
      allItems.map((s) => [s.name, s.category]),
    );
    const childParents = new Map<string, SkillCategory[]>();
    for (const item of allItems) {
      if (!item.children) continue;
      for (const child of item.children) {
        const list = childParents.get(child) ?? [];
        list.push(item.category);
        childParents.set(child, list);
      }
    }
    for (const [child, parentTypes] of childParents) {
      if (topLevelCategory.has(child)) continue; // top-level wins, no ambiguity
      const unique = new Set(parentTypes);
      expect(
        unique.size === 1,
        `"${child}" is listed as a child by parents of mixed types (${[...unique].join(', ')}) and has no top-level entry — add a top-level skill to disambiguate`,
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

  it('every item has a valid category', () => {
    const valid: SkillCategory[] = ['technology', 'concept', 'practice', 'organizational'];
    for (const item of allItems) {
      expect(
        valid.includes(item.category),
        `Skill "${item.name}" has invalid category "${item.category}" — must be one of ${valid.join(', ')}`,
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

  // Effective category per referenceable name. Top-level entries win over
  // parent inheritance, which is what enables cross-category relationships
  // (e.g. a `stack` skill can be listed as a child by a `method`-typed parent
  // without losing its own category when referenced from experience.stack).
  const nameCategory = (() => {
    const map = new Map<string, SkillCategory>();
    for (const item of allItems) map.set(item.name, item.category);
    for (const item of allItems) {
      if (!item.children) continue;
      for (const c of item.children) {
        if (!map.has(c)) map.set(c, item.category);
      }
    }
    return map;
  })();

  // Each experience field maps to exactly one skill category.
  function check(
    field: 'technologies' | 'concepts' | 'practices' | 'organizational',
    expected: SkillCategory,
  ) {
    for (const role of experience) {
      const list = role[field] ?? [];
      for (const name of list) {
        const actual = nameCategory.get(name);
        expect(
          actual !== undefined,
          `"${role.role} @ ${role.meta}" ${field} includes "${name}" — not a skill, child, or hidden historical entry. ` +
            `Either rename it to match skills.yaml, mark it as a child under a paraply, or add it to skills.yaml with hide: true.`,
        ).toBe(true);
        expect(
          actual,
          `"${role.role} @ ${role.meta}" lists "${name}" under ${field}, but it has category "${actual}" in skills.yaml. ` +
            `Expected "${expected}". Move it to the matching field, or fix the category in skills.yaml.`,
        ).toBe(expected);
      }
    }
  }

  it('every technologies item resolves to category "technology"', () => {
    check('technologies', 'technology');
  });

  it('every concepts item resolves to category "concept"', () => {
    check('concepts', 'concept');
  });

  it('every practices item resolves to category "practice"', () => {
    check('practices', 'practice');
  });

  it('every organizational item resolves to category "organizational"', () => {
    check('organizational', 'organizational');
  });
});

describe('experience description length', () => {
  const files = loadExperienceFiles();

  it.each(files)(`$file description is at most ${MAX_DESCRIPTION_LENGTH} characters`, ({
    file,
    data,
  }) => {
    const length = data.description.length;
    expect(
      length <= MAX_DESCRIPTION_LENGTH,
      `"${file}" description is ${length} characters — trim it to ${MAX_DESCRIPTION_LENGTH} or fewer.`,
    ).toBe(true);
  });
});
