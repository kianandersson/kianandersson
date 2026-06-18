import { Resend } from 'resend';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendContactMessageHandler } from './sendContactMessage';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
  Resend: vi.fn(function ResendMock(this: { emails: { send: typeof sendMock } }) {
    this.emails = { send: sendMock };
  }),
}));

const SEND_FAILED_MESSAGE = "Couldn't send the message — please try again in a moment.";

const validInput = {
  email: 'jane@example.com',
  subject: 'Project enquiry',
  message: 'Hello — would love to chat.',
};

function makeContext() {
  return { request: new Request('https://kianandersson.dk/_actions/sendContactMessage') };
}

describe('sendContactMessageHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends through Resend with `from` derived from the request host', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'msg_1' }, error: null });

    const result = await sendContactMessageHandler(validInput, makeContext());

    expect(result).toEqual({ ok: true });
    expect(vi.mocked(Resend)).toHaveBeenCalledWith('re_test_key');
    expect(sendMock).toHaveBeenCalledWith({
      from: 'kianandersson.dk <sender@kianandersson.dk>',
      to: expect.stringContaining('<mail@kianandersson.dk>'),
      replyTo: validInput.email,
      subject: validInput.subject,
      text: validInput.message,
    });
  });

  it('maps a Resend error response to an ActionError', async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { name: 'invalid_to_field', message: 'Recipient rejected' },
    });

    await expect(sendContactMessageHandler(validInput, makeContext())).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: SEND_FAILED_MESSAGE,
    });
  });

  it('maps a thrown Resend exception to an ActionError', async () => {
    sendMock.mockRejectedValueOnce(new Error('network'));

    await expect(sendContactMessageHandler(validInput, makeContext())).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: SEND_FAILED_MESSAGE,
    });
  });
});
