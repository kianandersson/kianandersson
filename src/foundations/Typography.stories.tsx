import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

type Role = {
  name: string;
  size: string;
  leading: string;
  sizePx: number;
  leadingValue: number;
  font?: 'sans' | 'mono';
  sample: string;
};

const ROLES: Role[] = [
  {
    name: 'display-xl',
    size: '--font-size-900',
    leading: '--line-height-200',
    sizePx: 48,
    leadingValue: 1.25,
    sample: "Hi, I'm Jane.",
  },
  {
    name: 'display-l',
    size: '--font-size-800',
    leading: '--line-height-200',
    sizePx: 36,
    leadingValue: 1.25,
    sample: 'Design system',
  },
  {
    name: 'heading-l',
    size: '--font-size-700',
    leading: '--line-height-200',
    sizePx: 30,
    leadingValue: 1.25,
    sample: 'Page heading',
  },
  {
    name: 'heading-m',
    size: '--font-size-600',
    leading: '--line-height-200',
    sizePx: 24,
    leadingValue: 1.25,
    sample: 'Section heading',
  },
  {
    name: 'heading-s',
    size: '--font-size-400',
    leading: '--line-height-500',
    sizePx: 18,
    leadingValue: 1.625,
    sample: 'Subsection heading',
  },
  {
    name: 'subheading',
    size: '--font-size-400',
    leading: '--line-height-400',
    sizePx: 18,
    leadingValue: 1.5,
    sample: 'Subheading text — used for the Hero tagline.',
  },
  {
    name: 'body',
    size: '--font-size-300',
    leading: '--line-height-500',
    sizePx: 16,
    leadingValue: 1.625,
    sample:
      'Body copy at 16 / 1.625. Used for the bulk of running text — descriptions, paragraphs, anything you read.',
  },
  {
    name: 'label',
    size: '--font-size-200',
    leading: '--line-height-400',
    sizePx: 14,
    leadingValue: 1.5,
    font: 'mono',
    sample: 'TO',
  },
  {
    name: 'caption-m',
    size: '--font-size-200',
    leading: '--line-height-400',
    sizePx: 14,
    leadingValue: 1.5,
    sample: 'Caption — used for meta text and timestamps.',
  },
  {
    name: 'caption-s',
    size: '--font-size-100',
    leading: '--line-height-400',
    sizePx: 12,
    leadingValue: 1.5,
    font: 'mono',
    sample: '#### TYPESCRIPT · 6Y',
  },
];

function RoleRow({ name, size, leading, sizePx, leadingValue, font, sample }: Role) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: 24,
        alignItems: 'baseline',
        paddingBottom: 16,
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text font="mono" size="caption-m">
          {name}
        </Text>
        <Text font="mono" size="caption-s" tone="subtle">
          {sizePx}px / {leadingValue}
        </Text>
        <Text font="mono" size="caption-s" tone="subtle">
          {size.replace('--font-size-', 'fs ')} · {leading.replace('--line-height-', 'lh ')}
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
    <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={1} size="l">
          Typography
        </Heading>
        <Text as="p" size="body" tone="muted">
          Tailwind-aligned size scale (`--font-size-100` …) paired with a small line-height ladder.
          Each role declares both a size and a leading; components reference the role, never the
          primitive.
        </Text>
        <Text as="p" size="caption-m" tone="subtle">
          Geist for sans, Geist Mono for code, meta, and labels. Both are variable fonts loaded from{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>public/fonts</code>.
        </Text>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ROLES.map((role) => (
          <RoleRow key={role.name} {...role} />
        ))}
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
