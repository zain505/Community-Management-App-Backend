import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../lib/token';
import { sendError } from '../lib/http';

function extractBearerToken(authorization?: string): string | null {
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.header('authorization'));

  if (!token) {
    sendError(res, StatusCodes.UNAUTHORIZED, {
      code: 'UNAUTHORIZED',
      message: 'Access token is required',
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = payload.sub;

    if (typeof userId !== 'string') {
      sendError(res, StatusCodes.UNAUTHORIZED, {
        code: 'INVALID_ACCESS_TOKEN',
        message: 'Access token is invalid',
      });
      return;
    }

    req.user = {
      id: userId,
      mobileNumber: typeof payload.mobileNumber === 'string' ? payload.mobileNumber : undefined,
    };
    next();
  } catch {
    sendError(res, StatusCodes.UNAUTHORIZED, {
      code: 'INVALID_ACCESS_TOKEN',
      message: 'Access token is invalid or expired',
    });
  }
}
