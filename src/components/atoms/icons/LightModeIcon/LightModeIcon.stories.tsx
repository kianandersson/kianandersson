import type { Meta, StoryObj } from '@storybook/preact-vite';
import { LightModeIcon } from './LightModeIcon';

const meta: Meta<typeof LightModeIcon> = {
  title: 'Atoms/Icons/LightModeIcon',
  component: LightModeIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 17 },
};

export default meta;
type Story = StoryObj<typeof LightModeIcon>;

export const Default: Story = {};
