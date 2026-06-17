import type { Meta, StoryObj } from '@storybook/preact-vite';
import { StatusIndicator } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Atoms/StatusIndicator',
  component: StatusIndicator,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['success', 'warning'] },
  },
  args: { tone: 'success' },
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning' } };
