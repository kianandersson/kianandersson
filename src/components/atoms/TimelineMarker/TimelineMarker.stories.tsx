import type { Meta, StoryObj } from '@storybook/preact-vite';
import { TimelineMarker } from './TimelineMarker';

const meta: Meta<typeof TimelineMarker> = {
  title: 'Atoms/TimelineMarker',
  component: TimelineMarker,
  render: () => (
    <div
      style={{
        position: 'relative',
        borderTop: '1px solid var(--color-divider)',
        paddingLeft: 'var(--space-xl)',
        paddingTop: 'var(--space-3xl)',
        paddingBottom: 'var(--space-2)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'var(--space-1)',
          top: 'var(--space-10)',
          bottom: 'var(--space-2)',
          width: '2px',
          background: 'var(--color-divider)',
        }}
      />
      <div style={{ position: 'relative' }}>
        <TimelineMarker />
        <div style={{ color: 'var(--color-text-muted)' }}>Timeline entry</div>
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof TimelineMarker>;

export const Default: Story = {};
