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
  groups: string[];
  featured: string[];
  items: Record<string, unknown>[];
};

const skills = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as SkillsFile;
      return parsed.items.map((entry) => ({
        id: slugify(String(entry.name)),
        ...entry,
      }));
    },
  }),
  schema: z
    .object({
      name: z.string().min(1),
      level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
      years: z.number().int().nonnegative().optional(),
      lastUsed: z.number().int().optional(),
      group: z.string().min(1).optional(),
      covers: z.array(z.string().min(1)).optional(),
      hide: z.boolean().optional(),
    })
    .refine(
      (data) =>
        data.hide === true ||
        (data.level !== undefined &&
          data.years !== undefined &&
          data.lastUsed !== undefined &&
          data.group !== undefined),
      {
        message:
          'A visible skill must have level, years, lastUsed, and group. Hidden skills (hide: true) may omit them.',
      },
    ),
});

const experience = defineCollection({
  loader: yamlDir('src/content/experience'),
  schema: z.object({
    role: z.string().min(1),
    meta: z.string().min(1),
    description: z.string().min(1),
    stack: z.array(z.string().min(1)),
    methods: z.array(z.string().min(1)),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
  }),
});

const skillGroups = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const parsed = yaml.load(text) as SkillsFile;
      return parsed.groups.map((name, index) => ({
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
