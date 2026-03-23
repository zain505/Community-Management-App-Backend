import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger';
import { sendError } from '../lib/http';
import { AppError } from '../shared/app-error';

function isPayloadTooLargeError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const payloadError = error as {
    type?: unknown;
    status?: unknown;
    statusCode?: unknown;
  };

  return (
    payloadError.type === 'entity.too.large' ||
    payloadError.status === StatusCodes.REQUEST_TOO_LONG ||
    payloadError.statusCode === StatusCodes.REQUEST_TOO_LONG
  );
}

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

  if (isPayloadTooLargeError(error)) {
    sendError(res, StatusCodes.REQUEST_TOO_LONG, {
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request payload is too large',
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
