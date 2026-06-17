import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ContactButton } from './ContactButton';

const meta: Meta<typeof ContactButton> = {
  title: 'Molecules/ContactButton',
  component: ContactButton,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['icon', 'labelled'] },
    isOpen: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    variant: 'labelled',
    isOpen: false,
    ariaLabel: 'Get in touch',
    controlsId: 'contact-region',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ContactButton>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /get in touch/i });
    await expect(button.textContent).toContain('Get in touch');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const IconVariant: Story = {
  args: { variant: 'icon' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /get in touch/i });
    await expect(button.textContent?.trim()).toBe('');
  },
};

export const Open: Story = {
  args: { variant: 'icon', isOpen: true },
  // Provide the aria-controls target so axe can resolve it; in production
  // Contact composes the region.
  render: (args) => (
    <>
      <ContactButton {...args} />
      <div id={args.controlsId} hidden />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /get in touch/i });
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveAttribute('aria-controls', 'contact-region');
  },
};
