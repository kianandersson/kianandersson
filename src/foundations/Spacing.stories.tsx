import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

const SCALE = [
  { token: '--space-2xs', primitive: '--space-1', px: 4 },
  { token: '--space-xs', primitive: '--space-2', px: 8 },
  { token: '--space-sm', primitive: '--space-3', px: 12 },
  { token: '--space-md', primitive: '--space-4', px: 16 },
  { token: '--space-lg', primitive: '--space-5', px: 20 },
  { token: '--space-xl', primitive: '--space-6', px: 24 },
  { token: '--space-2xl', primitive: '--space-7', px: 28 },
  { token: '--space-3xl', primitive: '--space-8', px: 32 },
  { token: '--space-4xl', primitive: '--space-10', px: 40 },
  { token: '--space-5xl', primitive: '--space-11', px: 44 },
  { token: '--space-6xl', primitive: '--space-12', px: 48 },
  { token: '--space-7xl', primitive: '--space-16', px: 64 },
];

function Row({ token, primitive, px }: { token: string; primitive: string; px: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 80px 1fr 120px',
        gap: 24,
        alignItems: 'center',
      }}
    >
      <Text font="mono" size="caption-m">
        {token}
      </Text>
      <Text font="mono" size="caption-s" tone="subtle">
        {px} px
      </Text>
      <div
        style={{
          height: 16,
          width: `var(${token})`,
          background: 'var(--color-accent-muted)',
          borderRadius: 'var(--radius-sm)',
        }}
      />
      <Text font="mono" size="caption-s" tone="subtle">
        {primitive}
      </Text>
    </div>
  );
}

function Page() {
  return (
    <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={1} size="l">
          Spacing
        </Heading>
        <Text as="p" size="body" tone="muted">
          4 px linear scale up to 64 px, exposed as a t-shirt naming for component consumption.
          Padding, margin, and gap reference t-shirt tokens. Positioning (`top`, `left`,
          `transform`) is the only place the half-step escape hatch{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>calc(var(--space-N) / 2)</code> is
          allowed.
        </Text>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SCALE.map((item) => (
          <Row key={item.token} {...item} />
        ))}
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Spacing',
  render: () => <Page />,
};
