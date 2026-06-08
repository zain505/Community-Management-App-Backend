import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { loginRateLimiter } from '../../middleware/rate-limit';
import { validate } from '../../middleware/validate';
import {
  changePassword,
  deleteUserAccount,
  getManagedUserStatus,
  getUserStatus,
  listAllUsers,
  listUsersPublic,
  login,
  logout,
  refresh,
  register,
  resetUserPasswordByMobileNumber,
  updateUserActivation,
  updateUserImage,
  updateUserName,
} from './auth.controller';
import {
  adminResetUserPasswordBodySchema,
  changePasswordBodySchema,
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
  updateUserActivationBodySchema,
  updateUserNameBodySchema,
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
authRouter.patch(
  '/users/me/password',
  requireAuth,
  loginRateLimiter,
  validate({ body: changePasswordBodySchema }),
  asyncHandler(changePassword),
);
authRouter.get('/users', requireAuth, asyncHandler(listAllUsers));
authRouter.post(
  '/admin/users/password/reset',
  requireAuth,
  validate({ body: adminResetUserPasswordBodySchema }),
  asyncHandler(resetUserPasswordByMobileNumber),
);
authRouter.patch(
  '/users/:id/status',
  requireAuth,
  validate({ params: userIdParamSchema, body: updateUserActivationBodySchema }),
  asyncHandler(updateUserActivation),
);
authRouter.delete(
  '/users/:id',
  requireAuth,
  validate({ params: userIdParamSchema }),
  asyncHandler(deleteUserAccount),
);
authRouter.patch(
  '/users/:id/name',
  requireAuth,
  validate({ params: userIdParamSchema, body: updateUserNameBodySchema }),
  asyncHandler(updateUserName),
);
authRouter.patch(
  '/users/:id/image',
  requireAuth,
  validate({ params: userIdParamSchema }),
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
