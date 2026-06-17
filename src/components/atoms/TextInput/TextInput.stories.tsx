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

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
};
