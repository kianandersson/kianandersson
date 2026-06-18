import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TextLink } from './TextLink';

const meta: Meta<typeof TextLink> = {
  title: 'Atoms/TextLink',
  component: TextLink,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['muted', 'default'] },
    inline: { control: 'boolean' },
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

export const Default: Story = {};

export const ClickBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /\+3 more/i });
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AsAnchor: Story = {
  /* Inert in Storybook — production callers pass the real URL.
     `javascript:void(0)` is fully no-op (doesn't update the URL hash). */
  args: { tone: 'default', children: 'open-source', href: 'javascript:void(0)' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /open-source/i });
    await expect(link).toHaveAttribute('href', args.href as string);
    // No target=_blank → no auto-rel.
    await expect(link).not.toHaveAttribute('rel');
  },
};

export const AsExternalAnchorBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  args: {
    tone: 'default',
    children: 'open-source',
    href: 'https://github.com',
    target: '_blank',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /open-source/i });
    await expect(link).toHaveAttribute('href', 'https://github.com');
    // target=_blank auto-adds rel="noopener noreferrer".
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

export const Inline: Story = {
  /* Inert in Storybook — production callers pass the real source URL.
     `javascript:void(0)` is fully no-op (doesn't update the URL hash). */
  args: { tone: 'default', inline: true, children: 'open-source', href: 'javascript:void(0)' },
  render: (args) => (
    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
      This website is <TextLink {...args} />
    </p>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /open-source/i });
    await expect(link).toHaveAttribute('href', args.href as string);
  },
};
