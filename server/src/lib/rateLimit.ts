import rateLimit from 'express-rate-limit';

/** Stricter than the app-wide limiter — prevents contact-form spam/abuse. */
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
