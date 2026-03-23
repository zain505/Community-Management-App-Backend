import { Router } from 'express';
import { asyncHandler } from '../../shared/async-handler';
import { loginRateLimiter } from '../../middleware/rate-limit';
import { validate } from '../../middleware/validate';
import { login, logout, refresh, register } from './auth.controller';
import { loginBodySchema, logoutBodySchema, refreshBodySchema, registerBodySchema } from './auth.schemas';

const authRouter = Router();

authRouter.post('/register', validate({ body: registerBodySchema }), asyncHandler(register));
authRouter.post('/login', loginRateLimiter, validate({ body: loginBodySchema }), asyncHandler(login));
authRouter.post('/refresh', validate({ body: refreshBodySchema }), asyncHandler(refresh));
authRouter.post('/logout', validate({ body: logoutBodySchema }), asyncHandler(logout));

export { authRouter };
