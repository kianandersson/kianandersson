import { z } from 'zod';

const SiteConfigSchema = z.object({
  name: z.string(),
  firstName: z.string(),
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
  analytics: z.object({
    cloudflareToken: z.string().optional(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export const siteConfig: SiteConfig = SiteConfigSchema.parse({
  name: 'Kian Andersson',
  firstName: 'Kian',
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
  analytics: {
    cloudflareToken: import.meta.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN,
  },
});
