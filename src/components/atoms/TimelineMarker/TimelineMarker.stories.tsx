import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect } from 'storybook/test';
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

export const Muted: Story = {
  render: () => (
    <div style={{ position: 'relative', paddingLeft: 'var(--space-3xl)' }}>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'var(--space-xs)',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--color-divider)',
        }}
      />
      <div style={{ position: 'relative' }}>
        <TimelineMarker tone="muted" />
        <div style={{ color: 'var(--color-text-muted)' }}>Nested project</div>
      </div>
    </div>
  ),
};

export const Bare: Story = {
  tags: ['!dev', '!autodocs'],
  render: () => <TimelineMarker />,
  play: async ({ canvasElement }) => {
    const marker = canvasElement.firstElementChild;
    await expect(marker).toBeInTheDocument();
    await expect(marker).toHaveAttribute('aria-hidden', 'true');
  },
};
