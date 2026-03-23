import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { checkDownstreamReadiness } from './health.service';

export function liveness(_req: Request, res: Response): void {
  sendSuccess(res, StatusCodes.OK, {
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

export async function readiness(_req: Request, res: Response): Promise<void> {
  const checks = await checkDownstreamReadiness();
  const ready = Object.values(checks).every(Boolean);

  sendSuccess(res, ready ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE, {
    status: ready ? 'ready' : 'not_ready',
    checks: {
      auth: checks.auth ? 'up' : 'down',
      store: checks.store ? 'up' : 'down',
      newsfeed: checks.newsfeed ? 'up' : 'down',
      app: checks.app ? 'up' : 'down',
    },
    timestamp: new Date().toISOString(),
  });
}
