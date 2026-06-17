import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Divider } from '../components/atoms/Divider';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

const SCALE = [
  { token: '--space-2xs', primitive: '--space-1', px: 4 },
  { token: '--space-xs', primitive: '--space-2', px: 8 },
  { token: '--space-s', primitive: '--space-3', px: 12 },
  { token: '--space-m', primitive: '--space-4', px: 16 },
  { token: '--space-l', primitive: '--space-5', px: 20 },
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
    <div class={styles.spacingRow}>
      <span class={styles.tokenChip}>{token}</span>
      <Text font="mono" size="caption-s" tone="muted">
        {px} px
      </Text>
      <div class={styles.spacingBar} data-size={token.replace('--space-', '')} />
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
          Spacing
        </Heading>
        <Text as="p" size="body" tone="muted">
          4 px linear scale up to 64 px, exposed as a t-shirt naming for component consumption.
          Padding, margin, and gap reference t-shirt tokens. Positioning is the only place the
          half-step escape hatch is allowed.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Scale" />
        <Divider />
        <div class={styles.spacingTable}>
          {SCALE.map((item) => (
            <Row key={item.token} {...item} />
          ))}
        </div>
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
