import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ChipList } from './ChipList';

const meta: Meta<typeof ChipList> = {
  title: 'Molecules/ChipList',
  component: ChipList,
  argTypes: {
    label: { control: 'text' },
    limit: { control: 'number' },
    variant: { control: { type: 'inline-radio' }, options: ['stack', 'methods'] },
  },
  args: {
    label: 'Stack',
    limit: 6,
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
    const overflowCount = (args.items as string[]).length - (args.limit as number);

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
    await expect(toggle).toHaveAccessibleName(new RegExp(`${overflowCount} more`, 'i'));

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
  args: { items: ['TypeScript', 'React', 'Preact'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-shown]')).toBeNull();
  },
};

export const Methods: Story = {
  args: {
    label: 'Methods',
    variant: 'methods',
    items: ['TDD', 'Atomic design', 'Pair programming', 'Trunk-based development'],
  },
};
