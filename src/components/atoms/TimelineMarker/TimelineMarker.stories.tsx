import type { Meta, StoryObj } from '@storybook/preact-vite';
import { TimelineMarker } from './TimelineMarker';

const meta: Meta<typeof TimelineMarker> = {
  title: 'Atoms/TimelineMarker',
  component: TimelineMarker,
  render: () => (
    <div
      style={{
        position: 'relative',
        height: 40,
        width: 200,
        paddingLeft: 32,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 28,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'var(--color-divider)',
        }}
      />
      <TimelineMarker />
      <span style={{ marginLeft: 16, color: 'var(--color-text-muted)' }}>Timeline entry</span>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof TimelineMarker>;

export const Default: Story = {};
