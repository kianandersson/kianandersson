import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { Divider } from '../components/atoms/Divider';
import { Heading } from '../components/atoms/Heading';
import {
  ArrowIcon,
  ChevronIcon,
  CloseIcon,
  ContactIcon,
  DarkModeIcon,
  GitHubIcon,
  LightModeIcon,
  PrintIcon,
  SendIcon,
} from '../components/atoms/icons';
import { Text } from '../components/atoms/Text';
import { SectionHeader } from '../components/molecules/SectionHeader';
import styles from './Foundation.module.css';

type Entry = {
  name: string;
  defaultSize: number;
  /** Extra prop hints for icons with variants beyond `size`. */
  variant?: string;
  render: () => JSX.Element;
};

const ICONS: Entry[] = [
  {
    name: 'ArrowIcon',
    defaultSize: 16,
    variant: 'direction',
    render: () => <ArrowIcon direction="right" />,
  },
  {
    name: 'ChevronIcon',
    defaultSize: 15,
    variant: 'direction',
    render: () => <ChevronIcon direction="right" />,
  },
  { name: 'CloseIcon', defaultSize: 16, render: () => <CloseIcon /> },
  { name: 'ContactIcon', defaultSize: 18, render: () => <ContactIcon /> },
  { name: 'DarkModeIcon', defaultSize: 17, render: () => <DarkModeIcon /> },
  { name: 'GitHubIcon', defaultSize: 17, render: () => <GitHubIcon /> },
  { name: 'LightModeIcon', defaultSize: 17, render: () => <LightModeIcon /> },
  { name: 'PrintIcon', defaultSize: 17, render: () => <PrintIcon /> },
  { name: 'SendIcon', defaultSize: 15, render: () => <SendIcon /> },
];

function IconTile({ name, defaultSize, variant, render }: Entry) {
  return (
    <div class={styles.iconTile}>
      <div class={styles.iconSample}>{render()}</div>
      <div class={styles.iconMeta}>
        <span class={styles.tokenChip}>{name}</span>
        <Text font="mono" size="caption-s" tone="subtle">
          size {defaultSize}
          {variant && ` · ${variant}`}
        </Text>
      </div>
    </div>
  );
}

function Page() {
  return (
    <div class={styles.page}>
      <header class={styles.head}>
        <Heading level={1} size="l">
          Icons
        </Heading>
        <Text as="p" size="body" tone="muted">
          A small stroke-based icon set, all single-color and shipped as inline SVG. Every icon
          takes an optional <code>size</code> prop (px); a couple add a <code>direction</code>{' '}
          variant. Colour comes from the surrounding text colour via <code>currentColor</code>.
        </Text>
        <Text as="p" size="caption-m" tone="subtle">
          Individual stories cover the prop combinations — this page is the picker.
        </Text>
      </header>

      <section class={styles.section}>
        <SectionHeader title="Catalog" />
        <Divider />
        <div class={styles.iconGrid}>
          {ICONS.map((icon) => (
            <IconTile key={icon.name} {...icon} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Icons',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Icons',
  render: () => <Page />,
};
