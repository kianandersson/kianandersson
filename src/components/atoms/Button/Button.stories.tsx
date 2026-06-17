import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['md', 'lg'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    size: 'md',
    children: 'Send message',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Medium: Story = {
  args: { size: 'md' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Back to home' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const AsLink: Story = {
  name: 'As link (href)',
  args: { href: '#', children: 'Anchor button' },
};
