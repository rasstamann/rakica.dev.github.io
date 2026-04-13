import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDb } from './lib/db';
import meRouter from './routes/me';
import projectsRouter from './routes/projects';

const app = express();
const rawPort = process.env.PORT ?? '3001';
const PORT = Number(rawPort);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());
// Trust the first proxy (Nginx) so Express sees real client IPs for rate limiting
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,  // use modern RateLimit-* headers
    legacyHeaders: false,   // suppress X-RateLimit-* headers
  }),
);

app.use('/api/me', meRouter);
app.use('/api/projects', projectsRouter);

// Catch-all error handler — prevents Express 5 from leaking stack traces to clients
app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
