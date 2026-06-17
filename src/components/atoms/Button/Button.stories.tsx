import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    children: 'Send message',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AsLink: Story = {
  name: 'As link (href)',
  args: { href: '#', children: 'Anchor button' },
};
