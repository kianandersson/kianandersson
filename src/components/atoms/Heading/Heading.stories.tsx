import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  argTypes: {
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3] },
    size: {
      control: { type: 'inline-radio' },
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

export const DisplayXL: Story = {
  args: { level: 1, size: 'display-xl', children: "Hi, I'm Kian." },
};

export const DisplayL: Story = {
  args: { level: 1, size: 'display-l', children: 'Display large' },
};

export const Large: Story = {
  args: { level: 1, size: 'l', children: 'Large heading' },
};

export const Medium: Story = {
  args: { level: 2, size: 'm', children: 'Medium heading' },
};

export const Small: Story = {
  args: { level: 3, size: 's', children: 'Small heading' },
};
