import { z } from 'zod';

const SiteConfigSchema = z.object({
  name: z.string(),
  firstName: z.string(),
  role: z.string(),
  email: z.email(),
  location: z.string(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    source: z.url(),
  }),
  hero: z.object({
    available: z.boolean(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export const siteConfig: SiteConfig = SiteConfigSchema.parse({
  name: 'Kian Andersson',
  firstName: 'Kian',
  role: 'Senior Full-stack Engineer',
  email: 'mail@kianandersson.dk',
  location: 'Denmark',
  links: {
    github: 'https://github.com/kianandersson',
    linkedin: 'https://www.linkedin.com/in/kianandersson',
    source: 'https://github.com/kianandersson/kianandersson.com',
  },
  hero: {
    available: true,
  },
});
