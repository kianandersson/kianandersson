import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import yaml from 'js-yaml';
import { z } from 'zod';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

export const collections = { skills };
