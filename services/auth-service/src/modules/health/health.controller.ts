import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { checkDatabaseReadiness } from './health.service';

export function liveness(_req: Request, res: Response): void {
  sendSuccess(res, StatusCodes.OK, {
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

export async function readiness(_req: Request, res: Response): Promise<void> {
  const databaseReady = await checkDatabaseReadiness();
  sendSuccess(res, databaseReady ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE, {
    status: databaseReady ? 'ready' : 'not_ready',
    checks: {
      database: databaseReady ? 'up' : 'down',
    },
    timestamp: new Date().toISOString(),
  });
}
