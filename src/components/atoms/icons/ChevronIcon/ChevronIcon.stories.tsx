import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ChevronIcon } from './ChevronIcon';

const meta: Meta<typeof ChevronIcon> = {
  title: 'Atoms/Icons/ChevronIcon',
  component: ChevronIcon,
  argTypes: {
    direction: { control: { type: 'inline-radio' }, options: ['up', 'right', 'down', 'left'] },
    size: { control: { type: 'number', min: 8, max: 64, step: 1 } },
  },
  args: { direction: 'down', size: 15 },
};

export default meta;
type Story = StoryObj<typeof ChevronIcon>;

export const Default: Story = {};
