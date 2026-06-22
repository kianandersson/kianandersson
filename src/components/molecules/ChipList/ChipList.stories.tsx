import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { sliceList } from '../../../lib/chip-list';
import { ChipList } from './ChipList';

const meta: Meta<typeof ChipList> = {
  title: 'Molecules/ChipList',
  component: ChipList,
  argTypes: {
    label: { control: 'text' },
    maxChars: { control: 'number' },
    minItems: { control: 'number' },
    variant: { control: { type: 'inline-radio' }, options: ['stack', 'domains'] },
  },
  args: {
    label: 'Stack',
    maxChars: 40,
    minItems: 3,
    variant: 'stack',
    items: ['TypeScript', 'React', 'Preact', 'Astro', 'Node', 'Vite', 'CSS Modules', 'Vitest'],
  },
};

export default meta;
type Story = StoryObj<typeof ChipList>;

export const WithOverflow: Story = {};

export const ExpandCollapseBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { hiddenCount } = sliceList(args.items as string[], {
      maxChars: args.maxChars as number,
      minItems: args.minItems as number | undefined,
    });

    await expect(canvas.getByText(args.label as string)).toBeInTheDocument();

    // Every item is in the DOM even while collapsed.
    for (const item of args.items as string[]) {
      await expect(canvas.getByText(item)).toBeInTheDocument();
    }

    const bucket = canvasElement.querySelector('[data-shown]');
    await expect(bucket).not.toBeNull();
    await expect(bucket).toHaveAttribute('data-shown', 'false');

    const toggle = canvas.getByRole('button');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName(new RegExp(`${hiddenCount} more`, 'i'));

    // Expand.
    await userEvent.click(toggle);
    await expect(bucket).toHaveAttribute('data-shown', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Collapse again.
    await userEvent.click(canvas.getByRole('button', { name: /less/i }));
    await expect(bucket).toHaveAttribute('data-shown', 'false');
  },
};

export const NoOverflow: Story = {
  args: { items: ['TypeScript', 'React', 'Preact'], maxChars: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-shown]')).toBeNull();
  },
};

export const Domains: Story = {
  args: {
    label: 'Domains',
    variant: 'domains',
    items: ['Design systems', 'Web performance', 'Accessibility', 'Developer experience'],
  },
};
