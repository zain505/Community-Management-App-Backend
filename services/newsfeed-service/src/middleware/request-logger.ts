import pinoHttp from 'pino-http';
import type { Request } from 'express';
import { logger } from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customProps: (req) => ({
    requestId: (req as Request).requestId,
  }),
});
