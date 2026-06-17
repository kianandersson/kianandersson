import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

type Role = {
  name: string;
  sizePx: number;
  leadingValue: number;
  sizePrimitive: number;
  leadingPrimitive: number;
  font?: 'sans' | 'mono';
  sample: string;
};

const ROLES: Role[] = [
  {
    name: 'display-xl',
    sizePx: 48,
    leadingValue: 1.25,
    sizePrimitive: 900,
    leadingPrimitive: 200,
    sample: "Hi, I'm Jane.",
  },
  {
    name: 'display-l',
    sizePx: 36,
    leadingValue: 1.25,
    sizePrimitive: 800,
    leadingPrimitive: 200,
    sample: 'Design system',
  },
  {
    name: 'heading-l',
    sizePx: 30,
    leadingValue: 1.25,
    sizePrimitive: 700,
    leadingPrimitive: 200,
    sample: 'Page heading',
  },
  {
    name: 'heading-m',
    sizePx: 24,
    leadingValue: 1.25,
    sizePrimitive: 600,
    leadingPrimitive: 200,
    sample: 'Section heading',
  },
  {
    name: 'heading-s',
    sizePx: 18,
    leadingValue: 1.625,
    sizePrimitive: 400,
    leadingPrimitive: 500,
    sample: 'Subsection heading',
  },
  {
    name: 'subheading',
    sizePx: 18,
    leadingValue: 1.5,
    sizePrimitive: 400,
    leadingPrimitive: 400,
    sample: 'Subheading text — used for the Hero tagline.',
  },
  {
    name: 'body',
    sizePx: 16,
    leadingValue: 1.625,
    sizePrimitive: 300,
    leadingPrimitive: 500,
    sample:
      'Body copy at 16 / 1.625. Used for the bulk of running text — descriptions, paragraphs, anything you read.',
  },
  {
    name: 'label',
    sizePx: 14,
    leadingValue: 1.5,
    sizePrimitive: 200,
    leadingPrimitive: 400,
    font: 'mono',
    sample: 'TO',
  },
  {
    name: 'caption-m',
    sizePx: 14,
    leadingValue: 1.5,
    sizePrimitive: 200,
    leadingPrimitive: 400,
    sample: 'Caption — used for meta text and timestamps.',
  },
  {
    name: 'caption-s',
    sizePx: 12,
    leadingValue: 1.5,
    sizePrimitive: 100,
    leadingPrimitive: 400,
    font: 'mono',
    sample: '#### TYPESCRIPT · 6Y',
  },
];

function RoleRow({
  name,
  sizePx,
  leadingValue,
  sizePrimitive,
  leadingPrimitive,
  font,
  sample,
}: Role) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 'var(--space-xl)',
        alignItems: 'baseline',
        paddingBottom: 'var(--space-lg)',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}>
        <span class={styles.tokenChip}>{name}</span>
        <Text font="mono" size="caption-s" tone="subtle">
          {sizePx} / {leadingValue}
        </Text>
        <Text font="mono" size="caption-s" tone="subtle">
          fs {sizePrimitive} · lh {leadingPrimitive}
        </Text>
      </div>
      <div
        style={{
          fontFamily: font === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: `var(--text-${name}-size)`,
          lineHeight: `var(--text-${name}-leading)`,
          color: 'var(--color-text)',
        }}
      >
        {sample}
      </div>
    </div>
  );
}

function Page() {
  return (
    <div class={styles.page}>
      <header class={styles.head}>
        <Heading level={1} size="l">
          Typography
        </Heading>
        <Text as="p" size="body" tone="muted">
          Tailwind-aligned size scale paired with a small line-height ladder. Each role declares
          both a size and a leading; components reference the role, never the primitive.
        </Text>
        <Text as="p" size="caption-m" tone="subtle">
          Geist for sans, Geist Mono for code, meta, and labels.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Roles" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {ROLES.map((role) => (
            <RoleRow key={role.name} {...role} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Typography',
  render: () => <Page />,
};
