import { describe, it, expect, mock, beforeEach } from 'bun:test';

let mockError: { message: string } | null = null;
const sendSpy = mock((_opts: Record<string, unknown>) =>
  Promise.resolve(mockError ? { data: null, error: mockError } : { data: { id: '123' }, error: null }),
);

// Must be called before the module under test is imported
mock.module('resend', () => ({
  Resend: class {
    emails = { send: sendSpy };
  },
}));

// The mailer builds its Resend client lazily and memoises it. Start with no key so the
// missing-key test below sees an unbuilt client; it is declared first for that reason.
delete process.env.RESEND_API_KEY;

const { sendContactEmail } = await import('./mailer');

const input = { senderEmail: 'visitor@example.com', subject: 'Hello', message: 'Hi there' };

describe('sendContactEmail without RESEND_API_KEY', () => {
  it('rejects instead of throwing at import time', async () => {
    await expect(sendContactEmail(input)).rejects.toThrow('RESEND_API_KEY is not set');
    expect(sendSpy).not.toHaveBeenCalled();
  });
});

describe('sendContactEmail', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key';
    mockError = null;
    sendSpy.mockClear();
  });

  it('sends with a fixed From address and the sender email as Reply-To only', async () => {
    await sendContactEmail({
      senderEmail: 'visitor@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });

    const call = sendSpy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.from).not.toBe('visitor@example.com');
    expect(call.replyTo).toBe('visitor@example.com');
  });

  it('includes the subject and message in the sent email', async () => {
    await sendContactEmail({
      senderEmail: 'visitor@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });

    const call = sendSpy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.subject).toContain('Hello');
    expect(call.text).toBe('Hi there');
  });

  it('throws when Resend returns an error', async () => {
    mockError = { message: 'invalid API key' };

    await expect(
      sendContactEmail({ senderEmail: 'visitor@example.com', subject: 'Hello', message: 'Hi' }),
    ).rejects.toThrow('invalid API key');
  });
});
