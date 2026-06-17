import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { Text } from '../../atoms/Text';
import { Window } from './Window';

const meta: Meta<typeof Window> = {
  title: 'Molecules/Window',
  component: Window,
};

export default meta;
type Story = StoryObj<typeof Window>;

export const WithTitle: Story = {
  args: {
    title: (
      <Text font="mono" size="caption-s" tone="muted">
        zsh
      </Text>
    ),
    children: (
      <div style={{ padding: 16, fontFamily: 'var(--font-mono)' }}>$ echo "hello, world"</div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('zsh')).toBeInTheDocument();
    await expect(canvas.getByText('$ echo "hello, world"')).toBeInTheDocument();
  },
};

export const Untitled: Story = {
  args: {
    children: <div style={{ padding: 16 }}>Window without a title.</div>,
  },
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll('[aria-hidden="true"]');
    await expect(dots.length).toBeGreaterThanOrEqual(3);
  },
};
