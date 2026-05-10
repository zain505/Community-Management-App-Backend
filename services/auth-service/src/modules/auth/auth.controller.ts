import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type {
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  TokenRefreshRequest,
  UpdateUserActivationRequest,
  UpdateUserNameRequest,
} from '@community/contracts';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { authService } from './auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body as RegisterRequest);
  sendSuccess(res, StatusCodes.CREATED, result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body as LoginRequest);
  sendSuccess(res, StatusCodes.OK, result);
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const payload = req.body as TokenRefreshRequest;
  const result = await authService.refresh(payload.refreshToken);
  sendSuccess(res, StatusCodes.OK, result);
}

export async function logout(req: Request, res: Response): Promise<void> {
  const payload = req.body as LogoutRequest;
  await authService.logout(payload.refreshToken);
  sendSuccess(res, StatusCodes.OK, {
    message: 'Logged out',
  });
}

export async function getUserStatus(req: Request, res: Response): Promise<void> {
  const user = await authService.getUserStatus((req.params as { id: string }).id);
  sendSuccess(res, StatusCodes.OK, user);
}

export async function getManagedUserStatus(req: Request, res: Response): Promise<void> {
  const user = await authService.getManagedUserStatus((req.params as { id: string }).id);
  sendSuccess(res, StatusCodes.OK, user);
}

export async function listUsersPublic(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as { ids: string[] };
  const users = await authService.listUsersPublicByIds(query.ids);
  sendSuccess(res, StatusCodes.OK, users);
}

export async function listAllUsers(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  const users = await authService.listAllUsers(req.user.id);
  sendSuccess(res, StatusCodes.OK, users);
}

export async function updateUserActivation(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  const payload = req.body as UpdateUserActivationRequest;
  const updatedUser = await authService.updateUserActivation({
    requesterId: req.user.id,
    userId: (req.params as { id: string }).id,
    isActive: payload.isActive,
  });

  sendSuccess(res, StatusCodes.OK, updatedUser);
}

export async function updateUserName(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  const payload = req.body as UpdateUserNameRequest;
  const updatedUser = await authService.updateUserName({
    requesterId: req.user.id,
    userId: (req.params as { id: string }).id,
    name: payload.name,
  });

  sendSuccess(res, StatusCodes.OK, updatedUser);
}

export async function updateUserImage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  if (!req.uploadedUserImage) {
    throw new AppError('Image is required', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'IMAGE_REQUIRED',
    });
  }

  const updatedUser = await authService.updateUserImage({
    requesterId: req.user.id,
    userId: (req.params as { id: string }).id,
    file: req.uploadedUserImage,
  });

  sendSuccess(res, StatusCodes.OK, updatedUser);
}
