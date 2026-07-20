import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { sendContactEmail } from '../lib/mailer';
import { contactRateLimiter } from '../lib/rateLimit';

export const contactSchema = z.object({
  senderEmail: z.string().trim().email(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export async function postContactHandler(req: Request, res: Response): Promise<void> {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  try {
    await sendContactEmail(parsed.data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('postContactHandler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const router = Router();
router.post('/', contactRateLimiter, postContactHandler);

export default router;
