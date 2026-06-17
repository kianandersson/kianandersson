import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PrintButton } from './PrintButton';

const meta: Meta<typeof PrintButton> = {
  title: 'Molecules/PrintButton',
  component: PrintButton,
};

export default meta;
type Story = StoryObj<typeof PrintButton>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /print/i });
    const originalPrint = window.print;
    const printSpy = fn();
    window.print = printSpy;
    try {
      await userEvent.click(button);
      await expect(printSpy).toHaveBeenCalledTimes(1);
    } finally {
      window.print = originalPrint;
    }
  },
};
