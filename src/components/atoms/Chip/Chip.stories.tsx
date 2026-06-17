import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['stack', 'methods'] },
    label: { control: 'text' },
  },
  args: {
    label: 'TypeScript',
    variant: 'stack',
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Stack: Story = {
  args: { variant: 'stack', label: 'TypeScript' },
};

export const Methods: Story = {
  args: { variant: 'methods', label: 'Test-driven development' },
};
