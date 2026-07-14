import { defineCollection } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { file, type Loader } from 'astro/loaders';
import yaml from 'js-yaml';
import { z } from 'zod';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function yamlDir(relativeDir: string): Loader {
  return {
    name: 'yaml-dir',
    load: async ({ store, parseData, generateDigest, logger }) => {
      const dir = resolve(process.cwd(), relativeDir);
      store.clear();
      const files = await readdir(dir);
      for (const fileName of files) {
        if (!fileName.endsWith('.yaml')) continue;
        const id = fileName.replace(/\.yaml$/, '');
        const text = await readFile(join(dir, fileName), 'utf-8');
        const raw = yaml.load(text) as Record<string, unknown>;
        const data = await parseData({ id, data: raw });
        store.set({ id, data, digest: generateDigest(text) });
      }
      logger.info(`Loaded ${store.keys().length} entries from ${relativeDir}`);
    },
  };
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

// A project groups work under a single engagement (e.g. multiple deliveries
// for the same client). When present, the frontend renders role/technologies/
// concepts from the project rather than the employment (see Experience.tsx).
const projectSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).optional(),
  concepts: z.array(z.string().min(1)).optional(),
  practices: z.array(z.string().min(1)).optional(),
  organizational: z.array(z.string().min(1)).optional(),
});

const experience = defineCollection({
  loader: yamlDir('src/content/experience'),
  schema: z
    .object({
      company: z.string().min(1),
      // Optional once `projects` are present: the detail then lives per-project
      // and these employment-level values are hidden in the frontend (they may
      // still be defined for the machine-readable output).
      role: z.string().min(1).optional(),
      description: z.string().min(1),
      technologies: z.array(z.string().min(1)).optional(),
      concepts: z.array(z.string().min(1)).optional(),
      practices: z.array(z.string().min(1)).optional(),
      organizational: z.array(z.string().min(1)).optional(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      projects: z.array(projectSchema).min(1).optional(),
    })
    .refine((data) => data.projects !== undefined || data.role !== undefined, {
      message: 'An experience without projects must define a role.',
      path: ['role'],
    })
    .refine((data) => data.projects !== undefined || data.technologies !== undefined, {
      message: 'An experience without projects must define technologies.',
      path: ['technologies'],
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
