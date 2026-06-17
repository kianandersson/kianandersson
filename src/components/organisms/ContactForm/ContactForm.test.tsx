import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './ContactForm';

const baseProps = {
  recipientName: 'Test Recipient',
  status: 'idle' as const,
  errorMessage: null,
};

describe('ContactForm', () => {
  it('shows the recipient without exposing an email address', () => {
    const { container } = render(<ContactForm {...baseProps} onSubmit={vi.fn()} />);
    expect(screen.getByText('Test Recipient')).toBeInTheDocument();
    expect(container.textContent).not.toContain('@');
  });

  it('keeps Send disabled until a valid email, subject and message are present', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...baseProps} onSubmit={vi.fn()} />);

    const send = screen.getByRole('button', { name: /send message/i });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText(/from/i), 'not-an-email');
    expect(send).toBeDisabled();

    await user.clear(screen.getByLabelText(/from/i));
    await user.type(screen.getByLabelText(/from/i), 'jane@example.com');
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText(/subject/i), 'Hello');
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText(/message/i), 'World');
    expect(send).toBeEnabled();
  });

  it('submits the trimmed payload', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ContactForm {...baseProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/from/i), '  jane@example.com  ');
    await user.type(screen.getByLabelText(/subject/i), '  Project enquiry  ');
    await user.type(screen.getByLabelText(/message/i), '  Hi there  ');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      subject: 'Project enquiry',
      message: 'Hi there',
    });
  });

  it('shows "Sending…" and disables Send while sending', () => {
    render(<ContactForm {...baseProps} status="sending" onSubmit={vi.fn()} />);
    const send = screen.getByRole('button', { name: /sending/i });
    expect(send).toBeDisabled();
    // The sending-state class lives on the wrapper span around the button.
    expect(send.parentElement?.className).toMatch(/_sending_/);
  });

  it('hides the error line until status is "error"', () => {
    render(
      <ContactForm {...baseProps} status="idle" errorMessage="Network hiccup" onSubmit={vi.fn()} />,
    );
    expect(screen.queryByText(/network hiccup/i)).not.toBeInTheDocument();
  });

  it('renders a subtle mono error line when status is "error"', () => {
    render(
      <ContactForm
        {...baseProps}
        status="error"
        errorMessage="Network hiccup"
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText(/network hiccup/i)).toBeInTheDocument();
  });
});
