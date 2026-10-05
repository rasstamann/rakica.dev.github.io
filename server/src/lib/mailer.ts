import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn(
    'RESEND_API_KEY is not set — contact form email delivery will fail until it is configured.',
  );
}

let client: Resend | null = null;

/** Built on first send, not at import time, so the server boots without an email key. */
function getClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is not set — cannot send contact email.');
    }
    client = new Resend(key);
  }
  return client;
}

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'noreply@rakica.dev';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'rakica@rakica.dev';

export type ContactEmailInput = {
  senderEmail: string;
  subject: string;
  message: string;
};

/** From is always the fixed verified sender; senderEmail is only ever used as Reply-To. */
export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const { error } = await getClient().emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    replyTo: input.senderEmail,
    subject: `[Contact form] ${input.subject}`,
    text: input.message,
  });

  if (error) {
    throw new Error(`Failed to send contact email: ${error.message}`);
  }
}
