import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../lib/http';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, StatusCodes.NOT_FOUND, {
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}
