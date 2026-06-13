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

const skills = defineCollection({
  loader: file('src/content/skills.yaml', {
    parser: (text) => {
      const entries = yaml.load(text) as Record<string, unknown>[];
      return entries.map((entry) => ({
        id: slugify(String(entry.name)),
        ...entry,
      }));
    },
  }),
  schema: z.object({
    name: z.string().min(1),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    years: z.number().int().nonnegative(),
    lastUsed: z.number().int(),
    group: z.string().min(1),
    keySkill: z.boolean(),
  }),
});

const experience = defineCollection({
  loader: yamlDir('src/content/experience'),
  schema: z.object({
    role: z.string().min(1),
    meta: z.string().min(1),
    period: z.string().min(1),
    description: z.string().min(1),
    stack: z.array(z.string().min(1)),
    methods: z.array(z.string().min(1)),
    start: z.coerce.date(),
  }),
});

export const collections = { skills, experience };
