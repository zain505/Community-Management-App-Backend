import { Router } from 'express';
import { asyncHandler } from '../../shared/async-handler';
import { liveness, readiness } from './health.controller';

const healthRouter = Router();

healthRouter.get('/health', liveness);
healthRouter.get('/ready', asyncHandler(readiness));

export { healthRouter };
