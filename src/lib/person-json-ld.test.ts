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
  {
    meta: 'Nordic SaaS ApS',
    role: 'Senior Full-stack Engineer',
    start: new Date('2021-06-01'),
    end: new Date('2023-02-28'),
  },
  {
    meta: 'Studio Nord',
    role: 'Full-stack Engineer',
    start: new Date('2019-08-01'),
    end: new Date('2021-05-31'),
  },
  {
    meta: 'Webbureau',
    role: 'Junior Developer',
    start: new Date('2017-01-01'),
    end: new Date('2019-07-31'),
  },
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

  it('emits the current occupation as a plain Occupation', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.hasOccupation?.[0]).toEqual({
      '@type': 'Occupation',
      name: 'Lead Engineer',
    });
  });

  it('wraps past occupations in Role with start + end dates per Schema.org guidance', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');

    expect(json.hasOccupation?.slice(1)).toEqual([
      {
        '@type': 'Role',
        startDate: '2021-06',
        endDate: '2023-02',
        hasOccupation: { '@type': 'Occupation', name: 'Senior Full-stack Engineer' },
      },
      {
        '@type': 'Role',
        startDate: '2019-08',
        endDate: '2021-05',
        hasOccupation: { '@type': 'Occupation', name: 'Full-stack Engineer' },
      },
      {
        '@type': 'Role',
        startDate: '2017-01',
        endDate: '2019-07',
        hasOccupation: { '@type': 'Occupation', name: 'Junior Developer' },
      },
    ]);
  });

  it('treats an entry without end as the current job and a sibling with end as past', () => {
    const json = buildPersonJsonLd(
      site,
      [
        { meta: 'Now Co', role: 'Lead', start: new Date('2024-01-01') },
        {
          meta: 'Then Co',
          role: 'Senior',
          start: new Date('2020-01-01'),
          end: new Date('2023-12-31'),
        },
      ],
      'https://kianandersson.dk/',
    );

    expect(json.worksFor).toEqual({ '@type': 'Organization', name: 'Now Co' });
    expect(json.alumniOf).toEqual([{ '@type': 'Organization', name: 'Then Co' }]);
    expect(json.hasOccupation).toEqual([
      { '@type': 'Occupation', name: 'Lead' },
      {
        '@type': 'Role',
        startDate: '2020-01',
        endDate: '2023-12',
        hasOccupation: { '@type': 'Occupation', name: 'Senior' },
      },
    ]);
  });

  it('omits worksFor and alumniOf when no experience is given', () => {
    const json = buildPersonJsonLd(site, [], 'https://kianandersson.dk/');

    expect(json.worksFor).toBeUndefined();
    expect(json.alumniOf).toBeUndefined();
    expect(json.hasOccupation).toBeUndefined();
  });

  it('lists provided skills as knowsAbout', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/', [
      { name: 'TypeScript' },
      { name: 'PostgreSQL' },
      { name: 'React' },
    ]);

    expect(json.knowsAbout).toEqual(['TypeScript', 'PostgreSQL', 'React']);
  });

  it('omits knowsAbout when no skills are provided', () => {
    const json = buildPersonJsonLd(site, experience, 'https://kianandersson.dk/');
    expect(json.knowsAbout).toBeUndefined();
  });
});
