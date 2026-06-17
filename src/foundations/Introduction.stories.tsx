import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

function Page() {
  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={1} size="display-l">
          Design system
        </Heading>
        <Text as="p" size="subheading" tone="muted">
          The catalog for a personal CV / freelance landing page. Tokens drive everything; the rule
          of two extracts shared anatomy on the second consumer.
        </Text>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={2} size="m">
          Foundations
        </Heading>
        <Text as="p" size="body" tone="muted">
          Tokens come in two layers — <strong>primitives</strong> (raw OKLCH values, pixel sizes,
          line heights) and <strong>semantics</strong> (roles that the components reference). The
          semantic layer is the only thing the components see; re-theming happens by re-pointing
          semantics, not by editing components.
        </Text>
        <ul style={{ paddingLeft: 20, color: 'var(--color-text)', lineHeight: 1.65 }}>
          <li>
            <strong>Colors</strong> — five hue families on a shared L ladder; semantic roles for
            surfaces, text, accent, status.
          </li>
          <li>
            <strong>Typography</strong> — Tailwind-aligned font-size scale + a small set of
            line-height multipliers, paired into named roles.
          </li>
          <li>
            <strong>Spacing</strong> — 4 px linear scale, exposed as t-shirt sizes for components.
          </li>
          <li>
            <strong>Radius</strong> — three steps plus a `--radius-full` escape for pills and
            circles.
          </li>
        </ul>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={2} size="m">
          Components
        </Heading>
        <Text as="p" size="body" tone="muted">
          Components are organised by Atomic Design layer. Astro files (templates, layouts, pages)
          are build-time compositions and don't have stories.
        </Text>
        <ul style={{ paddingLeft: 20, color: 'var(--color-text)', lineHeight: 1.65 }}>
          <li>
            <strong>Atoms</strong> — single-purpose primitives: typography, buttons, inputs, icons,
            status indicators.
          </li>
          <li>
            <strong>Molecules</strong> — small compositions of atoms: accordion, chip list, section
            header, theme toggle.
          </li>
          <li>
            <strong>Organisms</strong> — page-section compositions: Hero, Experience, KeySkills,
            Contact, NotFound.
          </li>
        </ul>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Heading level={2} size="m">
          Conventions
        </Heading>
        <Text as="p" size="body" tone="muted">
          Name by role, not appearance. A variant is a prop, not a new component. Components
          reference semantic tokens only. Full rules live in{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>docs/naming-conventions.md</code>.
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
