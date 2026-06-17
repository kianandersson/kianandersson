import type { Meta, StoryObj } from '@storybook/preact-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ContactForm } from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Organisms/ContactForm',
  component: ContactForm,
  argTypes: {
    status: {
      control: { type: 'inline-radio' },
      options: ['idle', 'sending', 'sent', 'error'],
    },
    recipientName: { control: 'text' },
  },
  args: {
    recipientName: 'Kian Andersson',
    status: 'idle',
    errorMessage: null,
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Idle: Story = {
  args: { status: 'idle' },
};

export const ValidationAndSubmitBehavior: Story = {
  args: { status: 'idle' },
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Recipient is shown, no email address leaked.
    await expect(canvas.getByText(args.recipientName as string)).toBeInTheDocument();
    await expect(canvasElement.textContent).not.toContain('@');

    const send = canvas.getByRole('button', { name: /send message/i });
    await expect(send).toBeDisabled();

    // Invalid email keeps Send disabled.
    await userEvent.type(canvas.getByLabelText(/from/i), 'not-an-email');
    await expect(send).toBeDisabled();

    // Valid email alone isn't enough.
    await userEvent.clear(canvas.getByLabelText(/from/i));
    await userEvent.type(canvas.getByLabelText(/from/i), '  jane@example.com  ');
    await expect(send).toBeDisabled();
    await userEvent.type(canvas.getByLabelText(/subject/i), '  Project enquiry  ');
    await expect(send).toBeDisabled();

    // All three fields → enabled. Submit and assert trimmed payload.
    await userEvent.type(canvas.getByLabelText(/message/i), '  Hi there  ');
    await expect(send).toBeEnabled();
    await userEvent.click(send);
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      subject: 'Project enquiry',
      message: 'Hi there',
    });
  },
};

export const Sending: Story = {
  args: { status: 'sending' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const send = canvas.getByRole('button', { name: /sending/i });
    await expect(send).toBeDisabled();
    // No plane flight while sending.
    await expect(send.parentElement?.className ?? '').not.toMatch(/_flying_/);
  },
};

export const Sent: Story = {
  args: { status: 'sent' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const send = canvas.getByRole('button', { name: /sending/i });
    await expect(send).toBeDisabled();
    await expect(send.parentElement?.className ?? '').toMatch(/_flying_/);
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    status: 'error',
    errorMessage: "Couldn't send — please try again in a moment.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Couldn't send/i)).toBeInTheDocument();
  },
};

export const ErrorHiddenWhileIdle: Story = {
  args: { status: 'idle', errorMessage: 'Network hiccup' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Network hiccup/i)).not.toBeInTheDocument();
  },
};
