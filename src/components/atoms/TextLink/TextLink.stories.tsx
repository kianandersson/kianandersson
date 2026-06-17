import type { Meta, StoryObj } from '@storybook/preact-vite';
import { TextLink } from './TextLink';

const meta: Meta<typeof TextLink> = {
  title: 'Atoms/TextLink',
  component: TextLink,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['muted', 'default'] },
    children: { control: 'text' },
  },
  args: {
    tone: 'muted',
    children: '+3 more',
  },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Muted: Story = { args: { tone: 'muted' } };

export const Default: Story = {
  args: { tone: 'default', children: 'open-source', href: '#' },
};

export const AsButton: Story = {
  name: 'As button',
  args: { children: 'Show less', 'aria-expanded': true },
};
