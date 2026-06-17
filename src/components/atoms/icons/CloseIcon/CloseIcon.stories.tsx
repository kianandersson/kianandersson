import type { Meta, StoryObj } from '@storybook/preact-vite';
import { CloseIcon } from './CloseIcon';

const meta: Meta<typeof CloseIcon> = {
  title: 'Atoms/Icons/CloseIcon',
  component: CloseIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 16 },
};

export default meta;
type Story = StoryObj<typeof CloseIcon>;

export const Default: Story = {};
