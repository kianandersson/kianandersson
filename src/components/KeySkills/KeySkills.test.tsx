import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SkillLevel } from '../../lib/skill';
import { KeySkills } from './KeySkills';

const sampleSkills = [
  { id: 'typescript', name: 'TypeScript', level: 5 as SkillLevel, years: 8 },
  { id: 'react', name: 'React', level: 4 as SkillLevel, years: 7 },
  { id: 'go', name: 'Go', level: 2 as SkillLevel, years: 2 },
];

describe('KeySkills', () => {
  it('announces the section with a "Key skills" heading', () => {
    render(<KeySkills skills={sampleSkills} />);
    expect(screen.getByRole('heading', { level: 2, name: /Key skills/i })).toBeInTheDocument();
  });

  it('renders one row per skill it receives', () => {
    render(<KeySkills skills={sampleSkills} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('renders nothing in the list when no skills are provided', () => {
    const { container } = render(<KeySkills skills={[]} />);
    expect(container.querySelectorAll('[data-state]').length).toBe(0);
  });
});
