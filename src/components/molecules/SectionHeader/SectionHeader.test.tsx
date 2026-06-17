import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders an h2 by default with the given title', () => {
    render(<SectionHeader title="Experience" />);
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
  });

  it('forwards id onto the heading element for aria-labelledby links', () => {
    render(<SectionHeader title="Skills" id="skills-heading" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'skills-heading');
  });

  it('renders the optional action slot at the trailing edge', () => {
    render(<SectionHeader title="Key skills" action={<a href="#all">All skills</a>} />);
    expect(screen.getByRole('link', { name: /all skills/i })).toBeInTheDocument();
  });

  it('respects an override level', () => {
    render(<SectionHeader title="Sub" level={3} size="s" />);
    expect(screen.getByRole('heading', { level: 3, name: /sub/i })).toBeInTheDocument();
  });
});
