import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger';
import { sendError } from '../lib/http';
import { AppError } from '../shared/app-error';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  void next;

  if (error instanceof AppError) {
    sendError(res, error.statusCode, {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  logger.error(
    {
      err: error,
      requestId: req.requestId,
      path: req.originalUrl,
      method: req.method,
    },
    'Unhandled error',
  );

  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  });
}
