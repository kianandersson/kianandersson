import { ActionError } from 'astro:actions';
import { Resend } from 'resend';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendContactMessageHandler } from './sendContactMessage';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
  Resend: vi.fn(function ResendMock(this: { emails: { send: typeof sendMock } }) {
    this.emails = { send: sendMock };
  }),
}));

function makeContext(url = 'https://kianandersson.dk/_actions/sendContactMessage') {
  return { request: new Request(url) };
}

const validInput = {
  email: 'jane@example.com',
  subject: 'Project enquiry',
  message: 'Hello — would love to chat.',
};

describe('sendContactMessageHandler', () => {
  afterEach(() => {
    sendMock.mockReset();
    vi.mocked(Resend).mockClear();
  });

  it('forwards a valid submission to Resend with from/replyTo derived from env and the request host', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'msg_1' }, error: null });

    const result = await sendContactMessageHandler(
      validInput,
      makeContext('https://kianandersson.dk/anything'),
    );

    expect(result).toEqual({ ok: true });
    expect(vi.mocked(Resend)).toHaveBeenCalledWith('re_test_key');
    expect(sendMock).toHaveBeenCalledWith({
      from: 'kianandersson.dk <sender@kianandersson.dk>',
      to: expect.stringContaining('<mail@kianandersson.dk>'),
      replyTo: 'jane@example.com',
      subject: 'Project enquiry',
      text: 'Hello — would love to chat.',
    });
  });

  it('maps a Resend failure response to an INTERNAL_SERVER_ERROR ActionError', async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { name: 'invalid_to_field', message: 'Recipient rejected' },
    });

    await expect(sendContactMessageHandler(validInput, makeContext())).rejects.toBeInstanceOf(
      ActionError,
    );
    await expect(sendContactMessageHandler(validInput, makeContext())).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Couldn't send the message — please try again in a moment.",
    });
  });

  it('maps a thrown Resend exception to an INTERNAL_SERVER_ERROR ActionError', async () => {
    sendMock.mockRejectedValue(new Error('network'));

    await expect(sendContactMessageHandler(validInput, makeContext())).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Couldn't send the message — please try again in a moment.",
    });
  });
});
