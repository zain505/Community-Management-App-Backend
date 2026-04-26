import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { loginRateLimiter } from '../../middleware/rate-limit';
import { validate } from '../../middleware/validate';
import {
  getManagedUserStatus,
  getUserStatus,
  listAllUsers,
  listUsersPublic,
  login,
  logout,
  refresh,
  register,
  updateUserActivation,
  updateUserImage,
} from './auth.controller';
import {
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
  updateUserActivationBodySchema,
  updateUserImageBodySchema,
  userIdParamSchema,
  userIdsQuerySchema,
} from './auth.schemas';
import { parseUserImageUpload } from './user-image-upload.middleware';

const authRouter = Router();
const internalAuthRouter = Router();

authRouter.post('/register', validate({ body: registerBodySchema }), asyncHandler(register));
authRouter.post(
  '/login',
  loginRateLimiter,
  validate({ body: loginBodySchema }),
  asyncHandler(login),
);
authRouter.post('/refresh', validate({ body: refreshBodySchema }), asyncHandler(refresh));
authRouter.post('/logout', validate({ body: logoutBodySchema }), asyncHandler(logout));
authRouter.get('/users', requireAuth, asyncHandler(listAllUsers));
authRouter.patch(
  '/users/:id/status',
  requireAuth,
  validate({ params: userIdParamSchema, body: updateUserActivationBodySchema }),
  asyncHandler(updateUserActivation),
);
authRouter.patch(
  '/users/:id/image',
  requireAuth,
  validate({ params: userIdParamSchema, body: updateUserImageBodySchema }),
  asyncHandler(parseUserImageUpload),
  asyncHandler(updateUserImage),
);

internalAuthRouter.get(
  '/users/:id/status',
  validate({ params: userIdParamSchema }),
  asyncHandler(getUserStatus),
);
internalAuthRouter.get(
  '/users/:id/managed-status',
  validate({ params: userIdParamSchema }),
  asyncHandler(getManagedUserStatus),
);
internalAuthRouter.get(
  '/users/public',
  validate({ query: userIdsQuerySchema }),
  asyncHandler(listUsersPublic),
);

export { authRouter, internalAuthRouter };
