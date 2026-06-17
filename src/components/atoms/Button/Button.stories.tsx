import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /send message/i });
    await expect(button.tagName).toBe('BUTTON');
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Submit: Story = {
  args: { type: 'submit', children: 'Submit form' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /submit form/i })).toHaveAttribute(
      'type',
      'submit',
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Off' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /off/i });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = {
  name: 'As link (href)',
  args: { href: '/path', children: 'Anchor button' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /anchor button/i });
    await expect(link.tagName).toBe('A');
    await expect(link).toHaveAttribute('href', '/path');
  },
};

export const ExternalLink: Story = {
  name: 'External link (target=_blank auto-injects rel)',
  args: { href: 'https://example.com', target: '_blank', children: 'External' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /external/i });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

export const ExternalLinkExplicitRel: Story = {
  name: 'External link with explicit rel',
  args: { href: 'https://example.com', target: '_blank', rel: 'me', children: 'External' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: /external/i })).toHaveAttribute('rel', 'me');
  },
};
