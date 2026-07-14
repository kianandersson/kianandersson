import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
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
    id: 'demo',
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

    await expect(canvas.getByText(args.label as string)).toBeInTheDocument();

    // Every item is in the DOM even while collapsed.
    for (const item of args.items as string[]) {
      await expect(canvas.getByText(item)).toBeInTheDocument();
    }

    // CSS-only disclosure: clicking the label toggles the associated checkbox.
    const checkbox = canvas.getByRole('checkbox');
    const label = canvasElement.querySelector('label[for]') as HTMLLabelElement;
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(label);
    await expect(checkbox).toBeChecked();

    await userEvent.click(label);
    await expect(checkbox).not.toBeChecked();
  },
};

export const NoOverflow: Story = {
  args: { items: ['TypeScript', 'React', 'Preact'], maxChars: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
  },
};

export const Domains: Story = {
  args: {
    label: 'Domains',
    variant: 'domains',
    items: ['Design systems', 'Web performance', 'Accessibility', 'Developer experience'],
  },
};
