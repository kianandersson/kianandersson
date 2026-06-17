import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { formatDate } from '../../../lib/formatDate';
import { Contact } from './Contact';

const ONE_DAY = 24 * 60 * 60 * 1000;

type Args = {
  recipientName: string;
  showAvailability: boolean;
  availableFrom: number;
};

function ContactDemo({ recipientName, showAvailability, availableFrom }: Args) {
  return (
    <Contact
      recipientName={recipientName}
      availableFrom={showAvailability ? new Date(availableFrom) : undefined}
    />
  );
}

const meta: Meta<typeof ContactDemo> = {
  title: 'Organisms/Contact',
  component: ContactDemo,
  argTypes: {
    recipientName: { control: 'text' },
    showAvailability: {
      control: 'boolean',
      description: 'Toggle off to render the labelled "Get in touch" pill instead.',
    },
    availableFrom: { control: 'date', if: { arg: 'showAvailability', truthy: true } },
  },
  args: {
    recipientName: 'Kian Andersson',
    showAvailability: true,
    availableFrom: Date.now() - 30 * ONE_DAY,
  },
};

export default meta;
type Story = StoryObj<typeof ContactDemo>;

export const AvailableNow: Story = {
  args: { showAvailability: true, availableFrom: Date.now() - 30 * ONE_DAY },
};

export const OpenCloseBehavior: Story = {
  args: { showAvailability: true, availableFrom: Date.now() - 30 * ONE_DAY },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Icon-only button — no visible label text.
    const button = canvas.getByRole('button', { name: /get in touch/i });
    await expect(button.textContent?.trim()).toBe('');

    // Available state + success tone.
    await expect(canvasElement.querySelector('[data-state="available"]')).not.toBeNull();
    await expect(canvasElement.querySelector('[data-tone="success"]')).not.toBeNull();
    await expect(canvas.getByText('Available for work')).toBeInTheDocument();

    // No email address leaks into the DOM.
    await expect(canvasElement.textContent).not.toContain('@');

    // Open / close cycle: aria-expanded toggles, aria-label flips, region data-open.
    const regionId = button.getAttribute('aria-controls');
    await expect(regionId).not.toBeNull();
    const region = canvasElement.querySelector(`#${CSS.escape(regionId as string)}`);

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(region).not.toHaveAttribute('data-open', 'true');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveAttribute('aria-label', 'Close contact form');
    await expect(region).toHaveAttribute('data-open', 'true');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  },
};

export const AvailableFromFuture: Story = {
  args: { showAvailability: true, availableFrom: Date.now() + 60 * ONE_DAY },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const futureLabel = formatDate(new Date(args.availableFrom as number));

    const button = canvas.getByRole('button', {
      name: new RegExp(
        `get in touch — available from ${futureLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
        'i',
      ),
    });
    await expect(button.textContent?.trim()).toBe('');

    await expect(canvasElement.querySelector('[data-state="future"]')).not.toBeNull();
    await expect(canvasElement.querySelector('[data-tone="warning"]')).not.toBeNull();
    await expect(canvas.getByText(futureLabel)).toBeInTheDocument();

    await expect(canvasElement.textContent).not.toContain('@');
  },
};

export const WithoutAvailability: Story = {
  args: { showAvailability: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /get in touch/i });
    await expect(button.textContent).toContain('Get in touch');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(canvasElement.querySelector('[data-state="available"]')).toBeNull();
    await expect(canvasElement.querySelector('[data-state="future"]')).toBeNull();
  },
};
