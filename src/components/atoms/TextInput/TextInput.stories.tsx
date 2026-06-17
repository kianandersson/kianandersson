import type { Meta, StoryObj } from '@storybook/preact-vite';
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
  },
  args: {
    type: 'text',
    placeholder: 'Type something…',
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Text: Story = {};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@company.com' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
};
