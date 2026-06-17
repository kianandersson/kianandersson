import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect } from 'storybook/test';
import { LevelMeter } from './LevelMeter';

const meta: Meta<typeof LevelMeter> = {
  title: 'Atoms/LevelMeter',
  component: LevelMeter,
  argTypes: {
    level: { control: { type: 'range', min: 1, max: 5, step: 1 } },
  },
  args: { level: 3 },
};

export default meta;
type Story = StoryObj<typeof LevelMeter>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const on = canvasElement.querySelectorAll('[data-state="on"]');
    const off = canvasElement.querySelectorAll('[data-state="off"]');
    await expect(on.length).toBe(args.level);
    await expect(off.length).toBe(5 - (args.level as number));
    await expect(canvasElement.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Min: Story = {
  args: { level: 1 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-state="on"]').length).toBe(1);
    await expect(canvasElement.querySelectorAll('[data-state="off"]').length).toBe(4);
  },
};

export const Full: Story = {
  args: { level: 5 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-state="on"]').length).toBe(5);
    await expect(canvasElement.querySelectorAll('[data-state="off"]').length).toBe(0);
  },
};
