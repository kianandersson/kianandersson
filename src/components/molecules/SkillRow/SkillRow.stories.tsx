import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { SkillLevel } from '../../../lib/skill';
import { SkillRow } from './SkillRow';

const meta: Meta<typeof SkillRow> = {
  title: 'Molecules/SkillRow',
  component: SkillRow,
  argTypes: {
    name: { control: 'text' },
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4, 5] satisfies SkillLevel[] },
    years: { control: 'number' },
  },
  args: { name: 'TypeScript', level: 5, years: 6 },
};

export default meta;
type Story = StoryObj<typeof SkillRow>;

export const Expert: Story = { args: { name: 'TypeScript', level: 5, years: 6 } };
export const Proficient: Story = { args: { name: 'React', level: 4, years: 4 } };
export const Intermediate: Story = { args: { name: 'Rust', level: 3, years: 2 } };
export const Beginner: Story = { args: { name: 'Elm', level: 1, years: 1 } };
