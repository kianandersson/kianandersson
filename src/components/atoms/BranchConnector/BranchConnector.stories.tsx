import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect } from 'storybook/test';
import { BranchConnector } from './BranchConnector';

const meta: Meta<typeof BranchConnector> = {
  title: 'Atoms/BranchConnector',
  component: BranchConnector,
  render: (args) => (
    <div style={{ position: 'relative', width: '80px', height: '120px', margin: '0 auto' }}>
      <span
        style={{ position: 'absolute', left: '24px', top: '24px', width: '28px', height: '40px' }}
      >
        <BranchConnector {...args} />
      </span>
    </div>
  ),
  args: { direction: 'fork' },
};

export default meta;
type Story = StoryObj<typeof BranchConnector>;

export const Fork: Story = { args: { direction: 'fork' } };
export const Merge: Story = { args: { direction: 'merge' } };

export const Rendered: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg?.querySelector('path')).toBeInTheDocument();
  },
};
