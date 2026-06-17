import type { Meta, StoryObj } from '@storybook/preact-vite';
import { DarkModeIcon } from './DarkModeIcon';

const meta: Meta<typeof DarkModeIcon> = {
  title: 'Atoms/Icons/DarkModeIcon',
  component: DarkModeIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 17 },
};

export default meta;
type Story = StoryObj<typeof DarkModeIcon>;

export const Default: Story = {};
