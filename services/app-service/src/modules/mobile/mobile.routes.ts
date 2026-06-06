import { Router } from 'express';
import { getVersionPolicy } from './mobile.controller';

const mobileRouter = Router();

mobileRouter.get('/version-policy', getVersionPolicy);

export { mobileRouter };
