import type { Meta, StoryObj } from '@storybook/preact-vite';
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
