import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Divider } from '../components/atoms/Divider';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

const RADII = [
  { token: '--radius-s', primitive: '--radius-100', value: '4 px', use: 'Chips, small bullets' },
  { token: '--radius-m', primitive: '--radius-200', value: '8 px', use: 'Buttons, toggles' },
  { token: '--radius-l', primitive: '--radius-300', value: '12 px', use: 'Surfaces, cards' },
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
    <div class={styles.radiusRow}>
      <div class={styles.radiusSample} data-size={token.replace('--radius-', '')} />
      <span class={styles.tokenChip}>{token}</span>
      <Text font="mono" size="caption-s" tone="muted">
        {value}
      </Text>
      <Text size="caption-m" tone="muted">
        {use}
      </Text>
      <Text font="mono" size="caption-s" tone="muted">
        <span class={styles.token}>{primitive}</span>
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
        <div class={styles.radiusTable}>
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
