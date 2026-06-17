import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { SkillLevel } from '../../../lib/skill';
import { LevelMeter } from './LevelMeter';

const meta: Meta<typeof LevelMeter> = {
  title: 'Atoms/LevelMeter',
  component: LevelMeter,
  argTypes: {
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4, 5] satisfies SkillLevel[] },
  },
  args: { level: 3 },
};

export default meta;
type Story = StoryObj<typeof LevelMeter>;

export const Level1: Story = { args: { level: 1 } };
export const Level2: Story = { args: { level: 2 } };
export const Level3: Story = { args: { level: 3 } };
export const Level4: Story = { args: { level: 4 } };
export const Level5: Story = { args: { level: 5 } };
