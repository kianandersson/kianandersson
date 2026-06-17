import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Atoms/TextInput',
  component: TextInput,
  argTypes: {
    type: {
      control: { type: 'inline-radio' },
      options: ['text', 'email', 'tel', 'url', 'search'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    type: 'text',
    placeholder: 'Type something…',
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {};

export const TypingBehavior: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Type something…') as HTMLInputElement;
    await expect(input.tagName).toBe('INPUT');
    await expect(input).toHaveAttribute('type', 'text');
    await userEvent.type(input, 'hello');
    await expect(input).toHaveValue('hello');
  },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'jane@example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('jane@example.com')).toHaveAttribute('type', 'email');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('Cannot edit')).toBeDisabled();
  },
};
