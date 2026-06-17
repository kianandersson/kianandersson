import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ArrowIcon } from './ArrowIcon';

const meta: Meta<typeof ArrowIcon> = {
  title: 'Atoms/Icons/ArrowIcon',
  component: ArrowIcon,
  argTypes: {
    direction: { control: { type: 'inline-radio' }, options: ['up', 'right', 'down', 'left'] },
    size: { control: { type: 'number', min: 8, max: 64, step: 1 } },
  },
  args: { direction: 'right', size: 16 },
};

export default meta;
type Story = StoryObj<typeof ArrowIcon>;

export const Default: Story = {};
