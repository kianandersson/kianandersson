import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  argTypes: {
    level: { control: { type: 'inline-radio' }, options: [1, 2, 3] },
    size: {
      control: { type: 'select' },
      options: ['display-xl', 'display-l', 'l', 'm', 's'],
    },
    children: { control: 'text' },
  },
  args: {
    level: 2,
    size: 'm',
    children: 'Section heading',
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: args.level, name: args.children as string }),
    ).toBeInTheDocument();
  },
};

export const Level1Display: Story = {
  args: { level: 1, size: 'display-xl', children: 'Kian Andersson' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument();
  },
};

export const Level3Sub: Story = {
  args: { level: 3, size: 's', children: 'Subsection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument();
  },
};
