import type { Meta, StoryObj } from '@storybook/preact-vite';
import { ContactForm } from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Organisms/ContactForm',
  component: ContactForm,
  argTypes: {
    status: { control: { type: 'inline-radio' }, options: ['idle', 'sending', 'error'] },
    recipientName: { control: 'text' },
  },
  args: {
    recipientName: 'Kian Andersson',
    status: 'idle',
    errorMessage: null,
    onSubmit: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Idle: Story = { args: { status: 'idle' } };

export const Sending: Story = { args: { status: 'sending' } };

export const ErrorState: Story = {
  name: 'Error',
  args: {
    status: 'error',
    errorMessage: "Couldn't send — please try again in a moment.",
  },
};
