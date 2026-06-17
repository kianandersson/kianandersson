import type { Meta, StoryObj } from '@storybook/preact-vite';
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

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
};
