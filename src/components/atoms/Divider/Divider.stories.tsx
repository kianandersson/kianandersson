import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ width: 320 }}>
      <Divider />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {};
