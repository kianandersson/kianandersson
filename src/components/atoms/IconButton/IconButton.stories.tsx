import type { Meta, StoryObj } from '@storybook/preact-vite';
import { GitHubIcon } from '../icons';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    disabled: { control: 'boolean' },
    'aria-label': { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    'aria-label': 'GitHub',
    title: 'GitHub',
    children: <GitHubIcon />,
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const AsLink: Story = {
  name: 'As link (href)',
  args: {
    href: 'https://github.com',
    target: '_blank',
  },
};
