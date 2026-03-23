import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
      details?: unknown;
    },
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = options?.code ?? 'INTERNAL_ERROR';
    this.details = options?.details;
  }
}
