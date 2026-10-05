import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function requireDb(_req: Request, res: Response, next: NextFunction): void {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }
  next();
}
