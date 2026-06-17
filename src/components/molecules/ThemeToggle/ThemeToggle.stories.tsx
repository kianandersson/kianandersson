import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ThemeToggle } from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};

export const RoundTripBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    localStorage.removeItem('theme');
    document.documentElement.dataset.theme = 'light';

    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /theme/i });

    await expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(document.documentElement.dataset.theme).toBe('dark');
    await expect(localStorage.getItem('theme')).toBe('dark');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(document.documentElement.dataset.theme).toBe('light');
    await expect(localStorage.getItem('theme')).toBe('light');
  },
};
