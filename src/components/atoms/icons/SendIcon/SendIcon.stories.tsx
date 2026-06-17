import type { Meta, StoryObj } from '@storybook/preact-vite';
import { SendIcon } from './SendIcon';

const meta: Meta<typeof SendIcon> = {
  title: 'Atoms/Icons/SendIcon',
  component: SendIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 15 },
};

export default meta;
type Story = StoryObj<typeof SendIcon>;

export const Default: Story = {};
