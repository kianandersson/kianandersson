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
  role: 'Full-Stack Engineering Lead',
  location: 'Denmark',
  tagline:
    'Engineering lead and architect with 15+ years across the stack, building design systems and accessible user interfaces, distributed services, and the engineering teams behind them.',
  availableFrom: '2026-06-01',
  links: {
    github: 'https://github.com/kianandersson',
    linkedin: 'https://www.linkedin.com/in/kianandersson',
    source: 'https://github.com/kianandersson/kianandersson',
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
