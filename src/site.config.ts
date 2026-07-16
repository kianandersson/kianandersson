import { z } from 'zod';
import { LANGUAGE_LEVELS, LANGUAGE_NAMES } from './lib/language';

const SiteConfigSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  location: z.string(),
  tagline: z.string(),
  links: z.object({
    website: z.url(),
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
export type SiteConfig = SiteConfigInput & { fullName: string; defaultTitle: string };

const parsed = SiteConfigSchema.parse({
  firstName: 'Kian',
  lastName: 'Andersson',
  role: 'Senior Full-Stack Engineer & Tech Lead',
  location: 'Denmark',
  tagline:
    'A senior full-stack engineer and tech lead with 15+ years across the stack, building design systems and accessible user interfaces, distributed services, and the engineering teams behind them.',
  availableFrom: '2026-06-01',
  links: {
    website: 'https://kianandersson.com',
    github: 'https://github.com/kianandersson',
    linkedin: 'https://www.linkedin.com/in/kianandersson',
    source: 'https://github.com/kianandersson/kianandersson',
  },
  languages: [
    { name: 'Danish', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
});

const fullName = `${parsed.firstName} ${parsed.lastName}`;

export const siteConfig: SiteConfig = {
  ...parsed,
  fullName,
  // Spaced pipe is the separator across every title/OG surface — kept here so
  // the convention lives in one place.
  defaultTitle: `${fullName} | ${parsed.role}`,
};
