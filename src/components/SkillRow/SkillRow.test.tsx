import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { SkillRow } from './SkillRow';

const TableWrapper = ({ children }: { children: ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

const baseProps = {
  name: 'TypeScript',
  level: 5,
  years: 8,
} as const;

describe('SkillRow', () => {
  it('shows the skill name', () => {
    render(<SkillRow {...baseProps} />, { wrapper: TableWrapper });
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('shows the level label for the given level', () => {
    render(<SkillRow {...baseProps} level={3} />, { wrapper: TableWrapper });
    expect(screen.getByText('Experienced')).toBeInTheDocument();
  });

  it('shows the years using the formatYears convention', () => {
    render(<SkillRow {...baseProps} years={1} />, { wrapper: TableWrapper });
    expect(screen.getByText('+1 yr')).toBeInTheDocument();
  });

  it('renders level and years in separate cells without a separator', () => {
    render(<SkillRow {...baseProps} level={5} years={8} />, { wrapper: TableWrapper });
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Expert\s*·/)).not.toBeInTheDocument();
  });

  it('renders the dot rating equal to the level', () => {
    const { container } = render(<SkillRow {...baseProps} level={4} />, {
      wrapper: TableWrapper,
    });
    expect(container.querySelectorAll('[data-state="on"]').length).toBe(4);
    expect(container.querySelectorAll('[data-state="off"]').length).toBe(1);
  });
});
