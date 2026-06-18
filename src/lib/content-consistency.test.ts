import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

type SkillItem = {
  name: string;
  level?: number;
  years?: number;
  lastUsed?: number;
  group?: string;
  covers?: string[];
  hide?: boolean;
};

type SkillsFile = {
  groups: string[];
  featured: string[];
  items: SkillItem[];
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

function loadExperience(): ExperienceFile[] {
  return readdirSync(EXPERIENCE_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => yaml.load(readFileSync(join(EXPERIENCE_DIR, file), 'utf-8')) as ExperienceFile);
}

describe('skills.yaml internal consistency', () => {
  const skills = loadSkills();
  const visibleItems = skills.items.filter((item) => !item.hide);

  it('every visible item.group exists in the groups list', () => {
    const groupNames = new Set(skills.groups);
    for (const item of visibleItems) {
      expect(
        groupNames.has(item.group as string),
        `Skill "${item.name}" has group "${item.group}" which is not in the groups list`,
      ).toBe(true);
    }
  });

  it('every group in the groups list is used by at least one visible skill', () => {
    const usedGroups = new Set(visibleItems.map((s) => s.group));
    for (const group of skills.groups) {
      expect(
        usedGroups.has(group),
        `Group "${group}" is declared but no visible skill uses it — remove or assign skills`,
      ).toBe(true);
    }
  });

  it('skill names are unique (visible + hidden)', () => {
    const counts = new Map<string, number>();
    for (const item of skills.items) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + 1);
    }
    for (const [name, count] of counts) {
      expect(count, `Skill "${name}" appears ${count} times`).toBe(1);
    }
  });

  it('covered names are not also standalone skills (pick one)', () => {
    const standaloneNames = new Set(skills.items.map((s) => s.name));
    for (const item of skills.items) {
      if (!item.covers) continue;
      for (const covered of item.covers) {
        expect(
          standaloneNames.has(covered),
          `"${item.name}" covers "${covered}", but "${covered}" is also a standalone skill — remove one`,
        ).toBe(false);
      }
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

  it('every featured name matches a visible standalone item', () => {
    const visibleNames = new Set(visibleItems.map((s) => s.name));
    for (const name of skills.featured) {
      expect(
        visibleNames.has(name),
        `featured entry "${name}" doesn't match any visible skill in items`,
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
  const experience = loadExperience();

  const validNames = (() => {
    const set = new Set<string>(skills.items.map((s) => s.name));
    for (const item of skills.items) {
      if (item.covers) for (const c of item.covers) set.add(c);
    }
    return set;
  })();

  function check(field: 'stack' | 'methods') {
    for (const role of experience) {
      for (const name of role[field]) {
        expect(
          validNames.has(name),
          `"${role.role} @ ${role.meta}" ${field} includes "${name}" — not a skill, cover, or hidden historical entry. ` +
            `Either rename it to match skills.yaml, mark it covered under a paraply, or add it to skills.yaml with hide: true.`,
        ).toBe(true);
      }
    }
  }

  it('every stack item matches a skill, cover, or allowlisted historical name', () => {
    check('stack');
  });

  it('every methods item matches a skill, cover, or allowlisted historical name', () => {
    check('methods');
  });
});
