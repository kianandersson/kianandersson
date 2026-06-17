import { z } from 'zod';
import { LANGUAGE_LEVELS, LANGUAGE_NAMES } from './lib/language';

const SiteConfigSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  location: z.string(),
  tagline: z.string(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    source: z.url(),
  }),
  availableFrom: z.coerce.date().optional(),
  languages: z.array(
    z.object({
      name: z.enum(LANGUAGE_NAMES),
      level: z.enum(LANGUAGE_LEVELS),
    }),
  ),
});

type SiteConfigInput = z.infer<typeof SiteConfigSchema>;
export type SiteConfig = SiteConfigInput & { fullName: string };

const parsed = SiteConfigSchema.parse({
  firstName: 'Kian',
  lastName: 'Andersson',
  role: 'Senior Full-stack Engineer',
  location: 'Denmark',
  tagline:
    'I build pragmatic, well-tested software across the stack — TypeScript, Node, and the front end.',
  availableFrom: '2026-06-01',
  links: {
    github: 'https://github.com/kianandersson',
    linkedin: 'https://www.linkedin.com/in/kianandersson',
    source: 'https://github.com/kianandersson/kianandersson.com',
  },
  languages: [
    { name: 'Danish', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
});

export const siteConfig: SiteConfig = {
  ...parsed,
  fullName: `${parsed.firstName} ${parsed.lastName}`,
};
