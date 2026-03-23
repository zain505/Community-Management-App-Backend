import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../lib/http';

function rateLimitHandler(scope: string) {
  return (_req: Request, res: Response): void => {
    sendError(res, 429, {
      code: 'RATE_LIMITED',
      message: `Too many requests for ${scope}. Please try again later.`,
    });
  };
}

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('global traffic'),
});

export const loginRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('login'),
});
