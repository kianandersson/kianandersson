interface PersonSource {
  fullName: string;
  role: string;
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
  end?: Date;
}

interface SkillSource {
  name: string;
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
  endDate?: string;
  hasOccupation: Occupation;
}

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url: string;
  jobTitle: string;
  address: { '@type': 'PostalAddress'; addressCountry: string };
  sameAs: string[];
  worksFor?: Organization;
  alumniOf?: Organization[];
  hasOccupation?: (Occupation | DatedRole)[];
  knowsAbout?: string[];
}

function toIsoMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function buildPersonJsonLd(
  site: PersonSource,
  experience: ExperienceSource[],
  url: string,
  skills: SkillSource[] = [],
): PersonJsonLd {
  const sorted = [...experience].sort((a, b) => b.start.getTime() - a.start.getTime());
  const current = sorted.find((entry) => !entry.end);
  const past = sorted.filter((entry) => entry.end);

  const hasOccupation: (Occupation | DatedRole)[] = [];
  if (current) {
    hasOccupation.push({ '@type': 'Occupation', name: current.role });
  }
  for (const entry of past) {
    hasOccupation.push({
      '@type': 'Role',
      startDate: toIsoMonth(entry.start),
      endDate: entry.end ? toIsoMonth(entry.end) : undefined,
      hasOccupation: { '@type': 'Occupation', name: entry.role },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.fullName,
    url,
    jobTitle: site.role,
    address: { '@type': 'PostalAddress', addressCountry: site.location },
    sameAs: [site.links.github, site.links.linkedin],
    worksFor: current ? { '@type': 'Organization', name: current.meta } : undefined,
    alumniOf: past.length
      ? past.map((entry) => ({ '@type': 'Organization', name: entry.meta }))
      : undefined,
    hasOccupation: hasOccupation.length ? hasOccupation : undefined,
    knowsAbout: skills.length ? skills.map((skill) => skill.name) : undefined,
  };
}
