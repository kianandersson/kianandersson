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

interface OrganizationRole {
  '@type': 'OrganizationRole';
  roleName: string;
  startDate: string;
  worksFor: Organization;
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
  hasOccupation?: OrganizationRole[];
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
    hasOccupation: sorted.length
      ? sorted.map((entry) => ({
          '@type': 'OrganizationRole',
          roleName: entry.role,
          startDate: toIsoDate(entry.start),
          worksFor: { '@type': 'Organization', name: entry.meta },
        }))
      : undefined,
  };
}
