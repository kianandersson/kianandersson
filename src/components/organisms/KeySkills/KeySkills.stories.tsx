import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { KeySkills } from './KeySkills';

const meta: Meta<typeof KeySkills> = {
  title: 'Organisms/KeySkills',
  component: KeySkills,
  args: {
    skills: [
      { id: 'ts', name: 'TypeScript', level: 5, years: 6 },
      { id: 'react', name: 'React', level: 5, years: 7 },
      { id: 'node', name: 'Node', level: 4, years: 6 },
      { id: 'astro', name: 'Astro', level: 4, years: 2 },
      { id: 'vite', name: 'Vite', level: 4, years: 3 },
    ],
    /* Inert in Storybook — the production caller wires this to the actual
       page anchor (#skills on the index page). `javascript:void(0)` is
       fully no-op (doesn't update the URL hash). */
    allSkillsHref: 'javascript:void(0)',
  },
};

export default meta;
type Story = StoryObj<typeof KeySkills>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: /Key skills/i }),
    ).toBeInTheDocument();
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength((args.skills as { id: string }[]).length);
    for (const skill of args.skills as { name: string }[]) {
      await expect(canvas.getByText(skill.name)).toBeInTheDocument();
    }
    await expect(canvas.getByRole('link', { name: /All skills/i })).toHaveAttribute(
      'href',
      args.allSkillsHref as string,
    );
  },
};

export const Empty: Story = {
  args: { skills: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
  },
};
