import { render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Experience, type ExperienceEntry } from './Experience';

const entries: ExperienceEntry[] = [
  {
    id: 'freelance',
    role: 'Lead Engineer',
    meta: 'Freelance',
    period: 'Mar 2023 — Present',
    description: 'Architect and ship products end-to-end.',
    stack: ['TypeScript', 'Next.js'],
    methods: ['Domain-Driven Design'],
  },
  {
    id: 'nordic-saas',
    role: 'Senior Full-stack Engineer',
    meta: 'Nordic SaaS ApS',
    period: 'Jun 2021 — Feb 2023',
    description: 'Owned the billing domain.',
    stack: ['React', 'Node'],
    methods: ['Pair programming'],
  },
];

describe('Experience', () => {
  it('announces the section with an "Experience" heading', () => {
    render(<Experience entries={entries} />);
    expect(screen.getByRole('heading', { level: 2, name: /Experience/i })).toBeInTheDocument();
  });

  it('renders one list item per entry', () => {
    render(<Experience entries={entries} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(entries.length);
  });

  it('renders the role, meta, period and description for every entry', () => {
    render(<Experience entries={entries} />);
    for (const entry of entries) {
      expect(screen.getByText(entry.role)).toBeInTheDocument();
      expect(screen.getByText(entry.meta)).toBeInTheDocument();
      expect(screen.getByText(entry.period)).toBeInTheDocument();
      expect(screen.getByText(entry.description)).toBeInTheDocument();
    }
  });

  it('renders a Stack and a Methods chip group for every entry', () => {
    render(<Experience entries={entries} />);
    const items = screen.getAllByRole('listitem');
    for (const item of items) {
      expect(within(item).getByText('Stack')).toBeInTheDocument();
      expect(within(item).getByText('Methods')).toBeInTheDocument();
    }
  });

  it('renders no entries when given an empty list', () => {
    render(<Experience entries={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
