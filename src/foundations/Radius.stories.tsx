import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Divider } from '../components/atoms/Divider';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

const RADII = [
  { token: '--radius-sm', primitive: '--radius-100', value: '4 px', use: 'Chips, small bullets' },
  { token: '--radius-md', primitive: '--radius-200', value: '8 px', use: 'Buttons, toggles' },
  { token: '--radius-lg', primitive: '--radius-300', value: '12 px', use: 'Surfaces, cards' },
  { token: '--radius-full', primitive: '—', value: '9999 px', use: 'Pills, circles' },
];

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
        gridTemplateColumns: '80px 160px 80px 1fr 120px',
        gap: 'var(--space-lg)',
        alignItems: 'center',
        paddingBottom: 'var(--space-md)',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          background: 'var(--color-accent-subtle)',
          border: '1px solid var(--color-accent-muted)',
          borderRadius: `var(${token})`,
        }}
      />
      <span class={styles.tokenChip}>{token}</span>
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
    <div class={styles.page}>
      <header class={styles.head}>
        <Heading level={1} size="l">
          Radius
        </Heading>
        <Text as="p" size="body" tone="muted">
          Three steps for square corners plus a --radius-full escape value for pills and circles.
          The full radius isn't part of the graduated scale — it's the "as round as possible"
          sentinel.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Scale" />
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {RADII.map((item) => (
            <Row key={item.token} {...item} />
          ))}
        </div>
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
