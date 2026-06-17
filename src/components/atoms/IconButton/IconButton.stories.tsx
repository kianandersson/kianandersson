import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /github/i });
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).not.toBeNull();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AsLink: Story = {
  name: 'As link (href)',
  args: {
    href: 'https://github.com',
    target: '_blank',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /github/i });
    await expect(link).toHaveAttribute('href', 'https://github.com');
  },
};
