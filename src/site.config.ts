import { z } from 'zod';
import { LANGUAGE_LEVELS, LANGUAGE_NAMES } from './lib/language';

const SiteConfigSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  location: z.string(),
  tagline: z.string(),
  /** Meta/OG description. Search results and link previews cut off around 160 characters. */
  description: z.string().max(160),
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
  /** Danish copy for the print CV (`locale: da`). */
  da: z.object({
    location: z.string(),
    tagline: z.string(),
  }),
});

type SiteConfigInput = z.infer<typeof SiteConfigSchema>;
export type SiteConfig = SiteConfigInput & { fullName: string; defaultTitle: string };

const parsed = SiteConfigSchema.parse({
  firstName: 'Kian',
  lastName: 'Andersson',
  role: 'Solution Architect & Tech Lead',
  location: 'Denmark',
  tagline:
    'A solution architect and tech lead with 15+ years in software engineering, building identity and access management solutions, distributed services, design systems and accessible user interfaces, and the engineering teams behind them.',
  description:
    'Freelance solution architect and tech lead in Denmark with 15+ years in software engineering and deep expertise in identity and access management.',
  availableFrom: '2026-11-02',
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
  da: {
    location: 'Danmark',
    tagline:
      'Løsningsarkitekt og tech lead med over 15 års erfaring inden for softwareudvikling. Jeg har bygget løsninger til identitets- og adgangsstyring, distribuerede services, designsystemer og tilgængelige brugerflader og opbygget de udviklingsteams, der står bag dem.',
  },
});

const fullName = `${parsed.firstName} ${parsed.lastName}`;

export const siteConfig: SiteConfig = {
  ...parsed,
  fullName,
  // Spaced pipe is the separator across every title/OG surface — kept here so
  // the convention lives in one place.
  defaultTitle: `${fullName} | ${parsed.role}`,
};
