import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FieldLabel } from './FieldLabel';

const meta: Meta<typeof FieldLabel> = {
  title: 'Atoms/FieldLabel',
  component: FieldLabel,
  argTypes: {
    for: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    for: 'demo-input',
    children: 'From',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FieldLabel {...args} />
      <input id={args.for as string} type="text" />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof FieldLabel>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText(args.children as string);
    const input = canvas.getByRole('textbox');
    await expect(label.tagName).toBe('LABEL');
    await expect(label).toHaveAttribute('for', args.for as string);
    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
};
