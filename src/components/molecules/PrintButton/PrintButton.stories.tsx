import type { Meta, StoryObj } from '@storybook/preact-vite';
import { PrintButton } from './PrintButton';

const meta: Meta<typeof PrintButton> = {
  title: 'Molecules/PrintButton',
  component: PrintButton,
};

export default meta;
type Story = StoryObj<typeof PrintButton>;

export const Default: Story = {};
