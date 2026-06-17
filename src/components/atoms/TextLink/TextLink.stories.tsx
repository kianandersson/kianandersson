import type { Meta, StoryObj } from '@storybook/preact-vite';
import { TextLink } from './TextLink';

const meta: Meta<typeof TextLink> = {
  title: 'Atoms/TextLink',
  component: TextLink,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['muted', 'default'] },
    children: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    tone: 'muted',
    children: '+3 more',
  },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {};

export const AsAnchor: Story = {
  name: 'As anchor (href)',
  args: { tone: 'default', children: 'open-source', href: '#' },
};
