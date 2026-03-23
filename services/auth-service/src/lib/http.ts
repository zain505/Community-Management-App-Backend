import type { Response } from 'express';
import type { ApiError, ApiSuccess } from '@community/contracts';

export function sendSuccess<T>(res: Response, statusCode: number, data: T): Response<ApiSuccess<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    requestId: res.req.requestId,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  payload: Omit<ApiError, 'success' | 'requestId'>,
): Response<ApiError> {
  return res.status(statusCode).json({
    success: false,
    ...payload,
    requestId: res.req.requestId,
  });
}
