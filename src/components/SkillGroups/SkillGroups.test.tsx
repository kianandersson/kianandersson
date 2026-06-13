import { render, screen, within } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { type SkillGroup, SkillGroups } from './SkillGroups';

const groups: SkillGroup[] = [
  {
    group: 'Programming Languages',
    skills: [
      { id: 'typescript', name: 'TypeScript', level: 5, years: 8 },
      { id: 'go', name: 'Go', level: 2, years: 2 },
    ],
  },
  {
    group: 'Frameworks & Libraries',
    skills: [{ id: 'react', name: 'React', level: 4, years: 7 }],
  },
];

describe('SkillGroups', () => {
  it('announces the section with a "Skills" heading', () => {
    render(<SkillGroups groups={groups} />);
    expect(screen.getByRole('heading', { level: 2, name: /^Skills$/i })).toBeInTheDocument();
  });

  it('exposes the section as a region named "Skills"', () => {
    render(<SkillGroups groups={groups} />);
    expect(screen.getByRole('region', { name: /Skills/i })).toBeInTheDocument();
  });

  it('renders one accordion trigger per group with its title', () => {
    render(<SkillGroups groups={groups} />);
    expect(screen.getByRole('button', { name: /Programming Languages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Frameworks & Libraries/i })).toBeInTheDocument();
  });

  it('shows the count of skills in each group on its trigger', () => {
    render(<SkillGroups groups={groups} />);
    const langTrigger = screen.getByRole('button', { name: /Programming Languages/i });
    expect(langTrigger).toHaveTextContent('2');
    const fwTrigger = screen.getByRole('button', { name: /Frameworks & Libraries/i });
    expect(fwTrigger).toHaveTextContent('1');
  });

  it('reveals the skills in a group when its trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<SkillGroups groups={groups} />);
    const trigger = screen.getByRole('button', { name: /Programming Languages/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('renders the skills inside a list', async () => {
    const user = userEvent.setup();
    render(<SkillGroups groups={groups} />);
    await user.click(screen.getByRole('button', { name: /Programming Languages/i }));
    const lists = screen.getAllByRole('list');
    const langList = lists.find((list) => within(list).queryByText('TypeScript') !== null);
    expect(langList).toBeDefined();
    if (langList) {
      expect(within(langList).getAllByRole('listitem')).toHaveLength(2);
    }
  });

  it('renders no triggers when given an empty list', () => {
    render(<SkillGroups groups={[]} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('closes the currently open group when a different group is opened', async () => {
    const user = userEvent.setup();
    render(<SkillGroups groups={groups} />);
    const langTrigger = screen.getByRole('button', { name: /Programming Languages/i });
    const fwTrigger = screen.getByRole('button', { name: /Frameworks & Libraries/i });

    await user.click(langTrigger);
    expect(langTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(fwTrigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(fwTrigger);
    expect(langTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(fwTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses a group when its own trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(<SkillGroups groups={groups} />);
    const trigger = screen.getByRole('button', { name: /Programming Languages/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
