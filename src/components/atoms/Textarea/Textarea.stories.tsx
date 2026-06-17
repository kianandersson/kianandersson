import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 20, step: 1 } },
  },
  args: {
    placeholder: 'Write your message…',
    'aria-label': 'Message',
    rows: 5,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const TypingBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ta = canvas.getByPlaceholderText('Write your message…') as HTMLTextAreaElement;
    await expect(ta.tagName).toBe('TEXTAREA');
    await userEvent.type(ta, 'hi');
    await expect(ta).toHaveValue('hi');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('Cannot edit')).toBeDisabled();
  },
};
