import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

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
  { family: 'sand', hue: 85, role: 'Warm neutral (light surfaces)' },
  { family: 'slate', hue: 286, role: 'Cool neutral (text, dark surfaces)' },
  { family: 'terracotta', hue: 34, role: 'Brand accent' },
  { family: 'green', hue: 149, role: 'Status — success' },
  { family: 'amber', hue: 78, role: 'Status — warning' },
];

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function Swatch({ background }: { background: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-divider)',
        background,
      }}
    />
  );
}

function SemanticTable() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr 1fr',
        columnGap: 16,
        rowGap: 8,
        alignItems: 'center',
      }}
    >
      <div />
      <Text font="mono" size="caption-s" tone="subtle">
        Token
      </Text>
      <Text font="mono" size="caption-s" tone="subtle">
        Role
      </Text>
      <Text font="mono" size="caption-s" tone="subtle">
        Resolves to
      </Text>
      {SEMANTIC_TOKENS.map(({ token, role, reference }) => (
        <>
          <Swatch background={`var(${token})`} />
          <Text font="mono" size="caption-m">
            {token}
          </Text>
          <Text size="caption-m" tone="muted">
            {role}
          </Text>
          <Text font="mono" size="caption-s" tone="subtle">
            {reference}
          </Text>
        </>
      ))}
    </div>
  );
}

function RampRow({ family, hue, role }: Ramp) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <Text font="mono" size="caption-m">
          {family}
        </Text>
        <Text font="mono" size="caption-s" tone="subtle">
          H {hue} · {role}
        </Text>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
        {STEPS.map((step) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
    <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={1} size="l">
          Colors
        </Heading>
        <Text as="p" size="body" tone="muted">
          Two layers: 55 OKLCH primitives across five hue families and a small semantic surface that
          components reference. The dark theme swaps the semantic layer; primitives are theme-
          agnostic.
        </Text>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Heading level={2} size="m">
          Semantic
        </Heading>
        <SemanticTable />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Heading level={2} size="m">
          Primitives
        </Heading>
        {RAMPS.map((ramp) => (
          <RampRow key={ramp.family} {...ramp} />
        ))}
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
