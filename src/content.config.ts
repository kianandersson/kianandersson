import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'zod';

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
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
