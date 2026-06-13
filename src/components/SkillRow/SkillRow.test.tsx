import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { SkillRow } from './SkillRow';

const ListWrapper = ({ children }: { children: ReactNode }) => <ul>{children}</ul>;

const baseProps = {
  name: 'TypeScript',
  level: 5,
  years: 8,
} as const;

describe('SkillRow', () => {
  it('shows the skill name', () => {
    render(<SkillRow {...baseProps} />, { wrapper: ListWrapper });
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('shows the level label for the given level', () => {
    render(<SkillRow {...baseProps} level={3} />, { wrapper: ListWrapper });
    expect(screen.getByText('Experienced')).toBeInTheDocument();
  });

  it('shows the years using the formatYears convention', () => {
    render(<SkillRow {...baseProps} years={1} />, { wrapper: ListWrapper });
    expect(screen.getByText('+1 yr')).toBeInTheDocument();
  });

  it('renders level and years without a "·" separator between them', () => {
    render(<SkillRow {...baseProps} level={5} years={8} />, { wrapper: ListWrapper });
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Expert\s*·/)).not.toBeInTheDocument();
  });

  it('renders the dot rating equal to the level', () => {
    const { container } = render(<SkillRow {...baseProps} level={4} />, {
      wrapper: ListWrapper,
    });
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(4);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(1);
  });

  it('exposes itself to assistive tech as a list item', () => {
    render(<SkillRow {...baseProps} />, { wrapper: ListWrapper });
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});
