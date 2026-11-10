import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import yaml from 'js-yaml';
import { z } from 'zod';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type SkillsFile = {
  featured: string[];
  groups: { name: string; skills: Record<string, unknown>[] }[];
};

const skills = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as SkillsFile;
      return parsed.groups.flatMap((group) =>
        group.skills.map((entry) => ({
          id: slugify(String(entry.name)),
          group: group.name,
          ...entry,
        })),
      );
    },
  }),
  schema: z
    .object({
      name: z.string().min(1),
      category: z.enum(['technology', 'concept', 'practice', 'organizational']),
      level: z
        .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
        .optional(),
      years: z.number().int().nonnegative().optional(),
      lastUsed: z.number().int().optional(),
      group: z.string().min(1),
      children: z.array(z.string().min(1)).optional(),
      hide: z.boolean().optional(),
    })
    .refine(
      (data) =>
        data.hide === true ||
        (data.level !== undefined && data.years !== undefined && data.lastUsed !== undefined),
      {
        message:
          'A visible skill must have level, years, and lastUsed. Hidden skills (hide: true) may omit them.',
      },
    ),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experience' }),
  schema: z.object({
    role: z.string().min(1),
    meta: z.string().min(1),
    description: z.string().min(1),
    technologies: z.array(z.string().min(1)),
    concepts: z.array(z.string().min(1)).optional(),
    practices: z.array(z.string().min(1)).optional(),
    organizational: z.array(z.string().min(1)).optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
  }),
});

const skillGroups = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as SkillsFile;
      return parsed.groups.map((group, index) => ({
        id: slugify(group.name),
        name: group.name,
        order: index,
      }));
    },
  }),
  schema: z.object({
    name: z.string().min(1),
    order: z.number().int().nonnegative(),
  }),
});

const keySkills = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as SkillsFile;
      return parsed.featured.map((name, index) => ({
        id: slugify(name),
        name,
        order: index,
      }));
    },
  }),
  schema: z.object({
    name: z.string().min(1),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = { skills, experience, skillGroups, keySkills };
