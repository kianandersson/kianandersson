import type { Meta, StoryObj } from '@storybook/preact-vite';
import { PrintIcon } from './PrintIcon';

const meta: Meta<typeof PrintIcon> = {
  title: 'Atoms/Icons/PrintIcon',
  component: PrintIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 17 },
};

export default meta;
type Story = StoryObj<typeof PrintIcon>;

export const Default: Story = {};
