import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SkillGroups } from './SkillGroups';

const meta: Meta<typeof SkillGroups> = {
  title: 'Organisms/Skills',
  component: SkillGroups,
  args: {
    groups: [
      {
        group: 'Languages',
        skills: [
          { id: 'ts', name: 'TypeScript', level: 5, years: 6 },
          { id: 'js', name: 'JavaScript', level: 5, years: 10 },
          { id: 'rust', name: 'Rust', level: 2, years: 1 },
        ],
      },
      {
        group: 'Frameworks',
        skills: [
          { id: 'react', name: 'React', level: 5, years: 7 },
          { id: 'astro', name: 'Astro', level: 4, years: 2 },
          { id: 'preact', name: 'Preact', level: 4, years: 2 },
        ],
      },
      {
        group: 'Tooling',
        skills: [
          { id: 'vite', name: 'Vite', level: 4, years: 3 },
          { id: 'vitest', name: 'Vitest', level: 4, years: 3 },
        ],
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SkillGroups>;

export const Default: Story = {};

export const SingleOpenBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2, name: /^Skills$/i })).toBeInTheDocument();

    const langTrigger = canvas.getByRole('button', { name: /Languages/i });
    const fwTrigger = canvas.getByRole('button', { name: /Frameworks/i });
    const toolTrigger = canvas.getByRole('button', { name: /Tooling/i });

    // Counts on triggers.
    await expect(langTrigger).toHaveTextContent('3');
    await expect(fwTrigger).toHaveTextContent('3');
    await expect(toolTrigger).toHaveTextContent('2');

    // All start collapsed.
    await expect(langTrigger).toHaveAttribute('aria-expanded', 'false');

    // Opening a group reveals its skills.
    await userEvent.click(langTrigger);
    await expect(langTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('TypeScript')).toBeInTheDocument();
    await expect(canvas.getByText('Rust')).toBeInTheDocument();

    // Opening another group closes the first (single-open).
    await userEvent.click(fwTrigger);
    await expect(langTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(fwTrigger).toHaveAttribute('aria-expanded', 'true');

    // Clicking the open trigger again collapses it.
    await userEvent.click(fwTrigger);
    await expect(fwTrigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Empty: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
  },
};
