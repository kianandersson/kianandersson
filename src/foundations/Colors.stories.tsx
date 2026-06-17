import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Divider } from '../components/atoms/Divider';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

type SemanticToken = { token: string; role: string; reference: string };

const SEMANTIC_TOKENS: SemanticToken[] = [
  { token: '--color-surface', role: 'Page background', reference: 'sand-50 / slate-950' },
  {
    token: '--color-surface-raised',
    role: 'Card / window background',
    reference: 'white / slate-800',
  },
  {
    token: '--color-surface-muted',
    role: 'Chip / subtle surface',
    reference: 'sand-200 / slate-700',
  },
  { token: '--color-divider', role: 'Hairlines & dividers', reference: 'sand-200 / slate-700' },
  { token: '--color-text', role: 'Body text', reference: 'slate-800 / slate-50' },
  {
    token: '--color-text-muted',
    role: 'Secondary text (meta, captions)',
    reference: 'slate-600 / slate-400',
  },
  {
    token: '--color-text-subtle',
    role: 'Tertiary text (decorative only)',
    reference: 'slate-400 / slate-600',
  },
  { token: '--color-accent', role: 'Brand accent', reference: 'terracotta-500' },
  {
    token: '--color-accent-strong',
    role: 'Accent text on hover/focus',
    reference: 'terracotta-600 / terracotta-400',
  },
  {
    token: '--color-accent-muted',
    role: 'Accent border tint',
    reference: 'mix(accent 32%, transparent)',
  },
  {
    token: '--color-accent-subtle',
    role: 'Accent halo / selection tint',
    reference: 'mix(accent 16%, transparent)',
  },
  {
    token: '--color-status-success',
    role: 'Available / success indicator',
    reference: 'green-500 / green-400',
  },
  {
    token: '--color-status-warning',
    role: 'Future-availability / warning',
    reference: 'amber-400 / amber-300',
  },
];

type Ramp = { family: string; hue: number; role: string };

const RAMPS: Ramp[] = [
  { family: 'sand', hue: 85, role: 'Warm neutral · light surfaces' },
  { family: 'slate', hue: 286, role: 'Cool neutral · text, dark surfaces' },
  { family: 'terracotta', hue: 34, role: 'Brand accent' },
  { family: 'green', hue: 149, role: 'Status · success' },
  { family: 'amber', hue: 78, role: 'Status · warning' },
];

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function SemanticRow({ token, role, reference }: SemanticToken) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 220px 1fr auto',
        columnGap: 'var(--space-lg)',
        rowGap: 'var(--space-2xs)',
        alignItems: 'center',
        paddingBottom: 'var(--space-md)',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <span
        style={{
          width: 56,
          height: 32,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-divider)',
          background: `var(${token})`,
        }}
      />
      <span class={styles.tokenChip}>{token}</span>
      <Text size="caption-m" tone="muted">
        {role}
      </Text>
      <Text font="mono" size="caption-s" tone="subtle">
        {reference}
      </Text>
    </div>
  );
}

function RampRow({ family, hue, role }: Ramp) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
        <span class={styles.tokenChip}>{family}</span>
        <Text font="mono" size="caption-s" tone="subtle">
          H {hue} · {role}
        </Text>
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 'var(--space-xs)' }}
      >
        {STEPS.map((step) => (
          <div
            key={step}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}
          >
            <span
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '1',
                background: `var(--color-${family}-${step})`,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
              }}
            />
            <Text font="mono" size="caption-s" tone="subtle">
              {step}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

function Page() {
  return (
    <div class={styles.page}>
      <header class={styles.head}>
        <Heading level={1} size="l">
          Colors
        </Heading>
        <Text as="p" size="body" tone="muted">
          Two layers — 55 OKLCH primitives across five hue families, and a small semantic surface
          that components reference. The dark theme swaps the semantic layer; primitives are
          theme-agnostic.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Semantic" />
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {SEMANTIC_TOKENS.map((row) => (
            <SemanticRow key={row.token} {...row} />
          ))}
        </div>
      </section>

      <section class={styles.section}>
        <SectionHeader title="Primitives" />
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {RAMPS.map((ramp) => (
            <RampRow key={ramp.family} {...ramp} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Colors',
  render: () => <Page />,
};
