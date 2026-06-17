import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ChipList } from './ChipList';

const meta: Meta<typeof ChipList> = {
  title: 'Molecules/ChipList',
  component: ChipList,
  argTypes: {
    label: { control: 'text' },
    limit: { control: 'number' },
    variant: { control: { type: 'inline-radio' }, options: ['stack', 'methods'] },
  },
  args: {
    label: 'Stack',
    limit: 6,
    variant: 'stack',
    items: ['TypeScript', 'React', 'Preact', 'Astro', 'Node', 'Vite', 'CSS Modules', 'Vitest'],
  },
};

export default meta;
type Story = StoryObj<typeof ChipList>;

export const WithOverflow: Story = {};

export const NoOverflow: Story = {
  args: { items: ['TypeScript', 'React', 'Preact'] },
};

export const Methods: Story = {
  args: {
    label: 'Methods',
    variant: 'methods',
    items: ['TDD', 'Atomic design', 'Pair programming', 'Trunk-based development'],
  },
};
