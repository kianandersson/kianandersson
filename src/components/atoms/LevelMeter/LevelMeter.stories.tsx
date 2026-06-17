import type { Meta, StoryObj } from '@storybook/preact-vite';
import { LevelMeter } from './LevelMeter';

const meta: Meta<typeof LevelMeter> = {
  title: 'Atoms/LevelMeter',
  component: LevelMeter,
  argTypes: {
    level: { control: { type: 'range', min: 1, max: 5, step: 1 } },
  },
  args: { level: 3 },
};

export default meta;
type Story = StoryObj<typeof LevelMeter>;

export const Default: Story = {};
