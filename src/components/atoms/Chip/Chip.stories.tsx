import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['stack', 'domains'] },
    label: { control: 'text' },
  },
  args: {
    label: 'TypeScript',
    variant: 'stack',
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const Domains: Story = {
  args: { label: 'Design systems', variant: 'domains' },
};
