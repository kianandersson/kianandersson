import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

const RADII = [
  { token: '--radius-sm', primitive: '--radius-100', value: '4 px', use: 'Chips, small bullets' },
  { token: '--radius-md', primitive: '--radius-200', value: '8 px', use: 'Buttons, toggles' },
  { token: '--radius-lg', primitive: '--radius-300', value: '12 px', use: 'Surfaces, cards' },
  { token: '--radius-full', primitive: '—', value: '9999 px', use: 'Pills, circles' },
];

function Sample({ token }: { token: string }) {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        background: 'var(--color-accent-subtle)',
        border: '1px solid var(--color-accent-muted)',
        borderRadius: `var(${token})`,
      }}
    />
  );
}

function Row({
  token,
  primitive,
  value,
  use,
}: {
  token: string;
  primitive: string;
  value: string;
  use: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 160px 100px 1fr 100px',
        gap: 24,
        alignItems: 'center',
      }}
    >
      <Sample token={token} />
      <Text font="mono" size="caption-m">
        {token}
      </Text>
      <Text font="mono" size="caption-s" tone="subtle">
        {value}
      </Text>
      <Text size="caption-m" tone="muted">
        {use}
      </Text>
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
          Radius
        </Heading>
        <Text as="p" size="body" tone="muted">
          Three steps for square corners plus a `--radius-full` escape value for pills and circles.
          The full radius isn't part of the graduated scale — it's the "as round as possible"
          sentinel.
        </Text>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {RADII.map((item) => (
          <Row key={item.token} {...item} />
        ))}
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Radius',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Radius',
  render: () => <Page />,
};
