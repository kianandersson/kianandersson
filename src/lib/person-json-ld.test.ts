import { describe, expect, it } from 'vitest';
import { buildPersonJsonLd } from './person-json-ld';

const site = {
  name: 'Kian Andersson',
  email: 'mail@example.com',
  location: 'Denmark',
  links: {
    github: 'https://github.com/kianandersson',
    linkedin: 'https://www.linkedin.com/in/kianandersson',
  },
};

const experience = [
  { meta: 'Freelance', role: 'Lead Engineer', start: new Date('2023-03-01') },
  { meta: 'Nordic SaaS ApS', role: 'Senior Full-stack Engineer', start: new Date('2021-06-01') },
  { meta: 'Studio Nord', role: 'Full-stack Engineer', start: new Date('2019-08-01') },
  { meta: 'Webbureau', role: 'Junior Developer', start: new Date('2017-01-01') },
];

describe('buildPersonJsonLd', () => {
  it('uses Schema.org Person with mailto email and provided URL', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('Kian Andersson');
    expect(json.email).toBe('mailto:mail@example.com');
    expect(json.url).toBe('https://kianandersson.dk/');
  });

  it('exposes sameAs links pointing at social profiles', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.sameAs).toEqual([
      'https://github.com/kianandersson',
      'https://www.linkedin.com/in/kianandersson',
    ]);
  });

  it('maps the most recent experience to worksFor', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.worksFor).toEqual({ '@type': 'Organization', name: 'Freelance' });
  });

  it('maps past experiences to alumniOf in reverse chronological order', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.alumniOf).toEqual([
      { '@type': 'Organization', name: 'Nordic SaaS ApS' },
      { '@type': 'Organization', name: 'Studio Nord' },
      { '@type': 'Organization', name: 'Webbureau' },
    ]);
  });

  it('emits hasOccupation entries with role + start date + employer', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.hasOccupation).toEqual([
      {
        '@type': 'OrganizationRole',
        roleName: 'Lead Engineer',
        startDate: '2023-03-01',
        worksFor: { '@type': 'Organization', name: 'Freelance' },
      },
      {
        '@type': 'OrganizationRole',
        roleName: 'Senior Full-stack Engineer',
        startDate: '2021-06-01',
        worksFor: { '@type': 'Organization', name: 'Nordic SaaS ApS' },
      },
      {
        '@type': 'OrganizationRole',
        roleName: 'Full-stack Engineer',
        startDate: '2019-08-01',
        worksFor: { '@type': 'Organization', name: 'Studio Nord' },
      },
      {
        '@type': 'OrganizationRole',
        roleName: 'Junior Developer',
        startDate: '2017-01-01',
        worksFor: { '@type': 'Organization', name: 'Webbureau' },
      },
    ]);
  });

  it('omits worksFor and alumniOf when no experience is given', () => {
    const json = buildPersonJsonLd(site, [], 'https://kianandersson.dk/');

    expect(json.worksFor).toBeUndefined();
    expect(json.alumniOf).toBeUndefined();
    expect(json.hasOccupation).toBeUndefined();
  });
});
