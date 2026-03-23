import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { LoginRequest, LogoutRequest, RegisterRequest, TokenRefreshRequest } from '@community/contracts';
import { sendSuccess } from '../../lib/http';
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
