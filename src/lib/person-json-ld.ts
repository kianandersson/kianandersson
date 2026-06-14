interface PersonSource {
  name: string;
  email: string;
  location: string;
  links: {
    github: string;
    linkedin: string;
  };
}

interface ExperienceSource {
  meta: string;
  role: string;
  start: Date;
}

interface Organization {
  '@type': 'Organization';
  name: string;
}

interface Occupation {
  '@type': 'Occupation';
  name: string;
}

interface DatedRole {
  '@type': 'Role';
  startDate: string;
  hasOccupation: Occupation;
}

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  email: string;
  url: string;
  jobTitle: string;
  address: { '@type': 'PostalAddress'; addressCountry: string };
  sameAs: string[];
  worksFor?: Organization;
  alumniOf?: Organization[];
  hasOccupation?: (Occupation | DatedRole)[];
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildPersonJsonLd(
  site: PersonSource,
  experience: ExperienceSource[],
  url: string,
): PersonJsonLd {
  const sorted = [...experience].sort((a, b) => b.start.getTime() - a.start.getTime());
  const [current, ...past] = sorted;

  const hasOccupation: (Occupation | DatedRole)[] = [];
  if (current) {
    hasOccupation.push({ '@type': 'Occupation', name: current.role });
  }
  for (const entry of past) {
    hasOccupation.push({
      '@type': 'Role',
      startDate: toIsoDate(entry.start),
      hasOccupation: { '@type': 'Occupation', name: entry.role },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    email: `mailto:${site.email}`,
    url,
    jobTitle: 'Senior Fullstack Engineer',
    address: { '@type': 'PostalAddress', addressCountry: site.location },
    sameAs: [site.links.github, site.links.linkedin],
    worksFor: current ? { '@type': 'Organization', name: current.meta } : undefined,
    alumniOf: past.length
      ? past.map((entry) => ({ '@type': 'Organization', name: entry.meta }))
      : undefined,
    hasOccupation: hasOccupation.length ? hasOccupation : undefined,
  };
}
