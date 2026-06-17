import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import type { SkillLevel } from '../../../lib/skill';
import { KeySkills } from './KeySkills';

const sampleSkills = [
  { id: 'typescript', name: 'TypeScript', level: 5 as SkillLevel, years: 8 },
  { id: 'react', name: 'React', level: 4 as SkillLevel, years: 7 },
  { id: 'go', name: 'Go', level: 2 as SkillLevel, years: 2 },
];

describe('KeySkills', () => {
  it('announces the section with a "Key skills" heading', () => {
    render(<KeySkills skills={sampleSkills} allSkillsHref="#skills" />);
    expect(screen.getByRole('heading', { level: 2, name: /Key skills/i })).toBeInTheDocument();
  });

  it('renders one list item per skill it receives', () => {
    render(<KeySkills skills={sampleSkills} allSkillsHref="#skills" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders the name of each skill', () => {
    render(<KeySkills skills={sampleSkills} allSkillsHref="#skills" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('renders no list items when no skills are provided', () => {
    render(<KeySkills skills={[]} allSkillsHref="#skills" />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('links to the full skills section', () => {
    render(<KeySkills skills={sampleSkills} allSkillsHref="#skills" />);
    expect(screen.getByRole('link', { name: /All skills/i })).toHaveAttribute('href', '#skills');
  });
});
