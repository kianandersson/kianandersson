import type { Meta, StoryObj } from '@storybook/preact-vite';
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
       page anchor (#skills on the index page). */
    allSkillsHref: '#',
  },
};

export default meta;
type Story = StoryObj<typeof KeySkills>;

export const Default: Story = {};
