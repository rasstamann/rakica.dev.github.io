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

const { sendContactEmail } = await import('./mailer');

describe('sendContactEmail', () => {
  beforeEach(() => {
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
