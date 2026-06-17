import type { Meta, StoryObj } from '@storybook/preact-vite';
import { SkillRow } from './SkillRow';

const meta: Meta<typeof SkillRow> = {
  title: 'Molecules/SkillRow',
  component: SkillRow,
  argTypes: {
    name: { control: 'text' },
    level: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    years: { control: { type: 'number', min: 0, max: 30, step: 1 } },
  },
  args: { name: 'TypeScript', level: 5, years: 6 },
};

export default meta;
type Story = StoryObj<typeof SkillRow>;

export const Default: Story = {};
