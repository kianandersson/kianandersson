import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import { DefinitionItem } from './DefinitionItem';

const meta: Meta<typeof DefinitionItem> = {
  title: 'Molecules/DefinitionItem',
  component: DefinitionItem,
  // dt/dd must live inside a dl.
  decorators: [
    (Story) => (
      <dl style={{ margin: 0 }}>
        <Story />
      </dl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DefinitionItem>;

export const PlainValue: Story = {
  args: { label: 'Location', value: 'Copenhagen, Denmark' },
};

export const Link: Story = {
  args: { label: 'Email', value: 'me@example.com', href: 'mailto:me@example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'me@example.com' })).toHaveAttribute(
      'href',
      'mailto:me@example.com',
    );
  },
};
