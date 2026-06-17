import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ContactIcon } from './ContactIcon';

const meta: Meta<typeof ContactIcon> = {
  title: 'Atoms/Icons/ContactIcon',
  component: ContactIcon,
  argTypes: { size: { control: { type: 'number', min: 8, max: 64, step: 1 } } },
  args: { size: 18 },
};

export default meta;
type Story = StoryObj<typeof ContactIcon>;

export const Default: Story = {};
