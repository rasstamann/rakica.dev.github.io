import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { Request, Response } from 'express';

let mockSendError: Error | null = null;
const sendContactEmailSpy = mock(() =>
  mockSendError ? Promise.reject(mockSendError) : Promise.resolve(undefined),
);

// Must be called before the module under test is imported
mock.module('../lib/mailer', () => ({
  sendContactEmail: sendContactEmailSpy,
}));

const { postContactHandler, contactSchema } = await import('./contact');

function makeMockReq(body: unknown): Request {
  return { body } as unknown as Request;
}

function makeMockRes() {
  const res = {} as unknown as Response;
  (res as unknown as Record<string, unknown>).json = mock(() => res);
  (res as unknown as Record<string, unknown>).status = mock(() => res);
  return res as Response & {
    json: ReturnType<typeof mock>;
    status: ReturnType<typeof mock>;
  };
}

const validBody = {
  senderEmail: 'visitor@example.com',
  subject: 'Hello',
  message: 'Interested in your work.',
};

describe('contactSchema', () => {
  it('accepts a valid payload', () => {
    expect(contactSchema.safeParse(validBody).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(contactSchema.safeParse({ ...validBody, senderEmail: 'not-an-email' }).success).toBe(
      false,
    );
  });

  it('rejects an empty message', () => {
    expect(contactSchema.safeParse({ ...validBody, message: '' }).success).toBe(false);
  });

  it('rejects an email longer than 254 characters', () => {
    const longEmail = `${'a'.repeat(250)}@example.com`;
    expect(contactSchema.safeParse({ ...validBody, senderEmail: longEmail }).success).toBe(false);
  });

  it('rejects a missing subject', () => {
    const rest = { senderEmail: validBody.senderEmail, message: validBody.message };
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });
});

describe('postContactHandler', () => {
  beforeEach(() => {
    mockSendError = null;
    sendContactEmailSpy.mockClear();
  });

  it('sends the email and returns 200 for a valid payload', async () => {
    const res = makeMockRes();
    await postContactHandler(makeMockReq(validBody), res);

    expect(sendContactEmailSpy).toHaveBeenCalledWith(validBody);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('returns 400 and does not send when the payload is invalid', async () => {
    const res = makeMockRes();
    await postContactHandler(makeMockReq({ ...validBody, senderEmail: 'nope' }), res);

    expect(sendContactEmailSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request' });
  });

  it('returns 500 when sending the email fails', async () => {
    mockSendError = new Error('Resend API down');
    const res = makeMockRes();
    await postContactHandler(makeMockReq(validBody), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
