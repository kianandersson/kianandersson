import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

type Bullet = { label: string; copy: string };

const FOUNDATIONS: Bullet[] = [
  {
    label: 'Colors',
    copy: 'Five hue families on a shared L ladder; semantic roles for surfaces, text, accent, status.',
  },
  {
    label: 'Typography',
    copy: 'Tailwind-aligned font-size scale paired with a small set of line-height multipliers, grouped into named roles.',
  },
  { label: 'Spacing', copy: '4 px linear scale exposed as t-shirt sizes for components.' },
  {
    label: 'Radius',
    copy: 'Three steps plus a --radius-full escape for pills and circles.',
  },
];

const LAYERS: Bullet[] = [
  {
    label: 'Atoms',
    copy: 'Single-purpose primitives — typography, buttons, inputs, icons, status indicators.',
  },
  {
    label: 'Molecules',
    copy: 'Small compositions of atoms — accordion, chip list, section header, theme toggle.',
  },
  {
    label: 'Organisms',
    copy: 'Page-section compositions — Hero, Experience, KeySkills, Contact, NotFound.',
  },
];

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            gap: 'var(--space-lg)',
            alignItems: 'baseline',
          }}
        >
          <Text font="mono" size="caption-m" tone="accent-strong" weight="semibold">
            {item.label}
          </Text>
          <Text size="body" tone="muted">
            {item.copy}
          </Text>
        </div>
      ))}
    </div>
  );
}

function Page() {
  return (
    <div class={styles.page}>
      <header class={styles.head}>
        <Heading level={1} size="display-l">
          Design system
        </Heading>
        <Text as="p" size="subheading" tone="muted">
          The catalog for a personal CV / freelance landing page. Tokens drive everything; the rule
          of two extracts shared anatomy on the second consumer.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Foundations" />
        <Text as="p" size="body" tone="muted">
          Tokens come in two layers — primitives (raw OKLCH, pixels, line heights) and semantics
          (the roles components reference). Components see the semantic layer only, so re-theming
          happens by re-pointing semantics, not by editing components.
        </Text>
        <BulletList items={FOUNDATIONS} />
      </section>

      <section class={styles.section}>
        <SectionHeader title="Components" />
        <Text as="p" size="body" tone="muted">
          Organised by Atomic Design layer. Astro files (templates, layouts, pages) are build-time
          compositions and don't have stories.
        </Text>
        <BulletList items={LAYERS} />
      </section>

      <section class={styles.section}>
        <SectionHeader title="Conventions" />
        <Text as="p" size="body" tone="muted">
          Name by role, not appearance. A variant is a prop, not a new component. Components
          reference semantic tokens only.
        </Text>
        <Text as="p" size="caption-m" font="mono" tone="subtle">
          docs/naming-conventions.md
        </Text>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Introduction',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Introduction',
  render: () => <Page />,
};
