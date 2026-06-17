import type { Meta, StoryObj } from '@storybook/preact-vite';
import { useState } from 'preact/hooks';
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
