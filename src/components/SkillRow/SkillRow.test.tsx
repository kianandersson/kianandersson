import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillRow } from './SkillRow';

const baseProps = {
  name: 'TypeScript',
  level: 5,
  years: 8,
} as const;

describe('SkillRow', () => {
  it('shows the skill name', () => {
    render(<SkillRow {...baseProps} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('shows the level label for the given level', () => {
    render(<SkillRow {...baseProps} level={3} />);
    expect(screen.getByText(/Experienced/)).toBeInTheDocument();
  });

  it('shows the years using the formatYears convention', () => {
    render(<SkillRow {...baseProps} years={1} />);
    expect(screen.getByText(/\+1 yr\b/)).toBeInTheDocument();
  });

  it('renders the dot rating equal to the level', () => {
    const { container } = render(<SkillRow {...baseProps} level={4} />);
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(4);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(1);
  });
});
