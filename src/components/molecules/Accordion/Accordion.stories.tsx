import type { Meta, StoryObj } from '@storybook/preact-vite';
import { useState } from 'preact/hooks';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  argTypes: {
    title: { control: 'text' },
    count: { control: 'number' },
  },
  args: {
    title: 'Frontend',
    count: 6,
    children: (
      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
        Body content goes here. Anything can be rendered inside the accordion panel.
      </p>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return <Accordion {...args} isOpen={open} onToggle={() => setOpen((v) => !v)} />;
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const ExpandCollapseBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /frontend/i });

    // Initial collapsed state.
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panelId = trigger.getAttribute('aria-controls');
    await expect(panelId).toBeTruthy();
    const panel = canvasElement.querySelector(`#${panelId}`);
    await expect(panel).not.toBeNull();
    await expect(panel).toHaveAttribute('inert');

    // Panel content stays in the DOM even while collapsed.
    await expect(canvas.getByText(/Body content goes here/i)).toBeInTheDocument();

    // Open.
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).not.toHaveAttribute('inert');

    // Close again.
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveAttribute('inert');
  },
};

export const WithCount: Story = {
  args: { count: 12 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('12')).toBeInTheDocument();
  },
};
