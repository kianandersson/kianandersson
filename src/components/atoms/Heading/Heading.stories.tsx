import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  argTypes: {
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3] },
    size: {
      control: { type: 'select' },
      options: ['display-xl', 'display-l', 'l', 'm', 's'],
    },
    children: { control: 'text' },
  },
  args: {
    level: 2,
    size: 'm',
    children: 'Section heading',
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {};
