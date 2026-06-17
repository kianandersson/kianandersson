import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /\+3 more/i });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AsAnchor: Story = {
  args: { tone: 'default', children: 'open-source', href: '#' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /open-source/i });
    await expect(link).toHaveAttribute('href', '#');
  },
};
