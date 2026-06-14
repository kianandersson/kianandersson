import { render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import type { Language } from '../../lib/language';
import { Miscellaneous } from './Miscellaneous';

const sampleLanguages: Language[] = [
  { name: 'Danish', level: 'Native' },
  { name: 'English', level: 'Fluent' },
];

describe('Miscellaneous', () => {
  it('announces the section with a "Miscellaneous" heading', () => {
    render(<Miscellaneous languages={sampleLanguages} />);
    expect(screen.getByRole('heading', { level: 2, name: /Miscellaneous/i })).toBeInTheDocument();
  });

  it('renders one list item per language with its proficiency', () => {
    render(<Miscellaneous languages={sampleLanguages} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('Danish')).toBeInTheDocument();
    expect(within(items[0]).getByText('Native')).toBeInTheDocument();
    expect(within(items[1]).getByText('English')).toBeInTheDocument();
    expect(within(items[1]).getByText('Fluent')).toBeInTheDocument();
  });

  it('labels the languages row', () => {
    render(<Miscellaneous languages={sampleLanguages} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('renders no list items when no languages are provided', () => {
    render(<Miscellaneous languages={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
