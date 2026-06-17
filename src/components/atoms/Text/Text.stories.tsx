import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect } from 'storybook/test';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    as: { control: { type: 'inline-radio' }, options: ['p', 'span', 'div'] },
    size: {
      control: { type: 'select' },
      options: ['caption-s', 'caption-m', 'label', 'body', 'subheading', 'heading-s'],
    },
    tone: {
      control: { type: 'select' },
      options: ['default', 'muted', 'subtle', 'accent', 'accent-strong'],
    },
    font: { control: { type: 'inline-radio' }, options: ['sans', 'mono'] },
    weight: { control: { type: 'inline-radio' }, options: ['regular', 'medium', 'semibold'] },
    children: { control: 'text' },
  },
  args: {
    as: 'p',
    size: 'body',
    tone: 'default',
    font: 'sans',
    weight: 'regular',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const el = canvasElement.firstElementChild as HTMLElement | null;
    await expect(el?.tagName).toBe((args.as ?? 'span').toUpperCase());
  },
};

export const Span: Story = {
  args: { as: 'span' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild?.tagName).toBe('SPAN');
  },
};

export const MonoCaption: Story = {
  name: 'Mono caption (e.g. timeline meta)',
  args: { size: 'caption-s', font: 'mono', tone: 'muted', children: '#### TYPESCRIPT · 6Y' },
};
