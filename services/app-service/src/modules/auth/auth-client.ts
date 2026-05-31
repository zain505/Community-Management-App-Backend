import type { ApiError, ApiSuccess, ManagedUserStatus, UserStatus } from '@community/contracts';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../shared/app-error';

type UserStatusResponse = ApiSuccess<UserStatus> | ApiError;
type ManagedUserStatusResponse = ApiSuccess<ManagedUserStatus> | ApiError;

function throwAuthServiceUnavailable(details: Record<string, unknown>): never {
  logger.error(details, 'Failed to verify user status with auth-service');

  throw new AppError('Auth service is unavailable', {
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    code: 'AUTH_SERVICE_UNAVAILABLE',
  });
}

export const authClient = {
  async getUserStatus(userId: string): Promise<UserStatus | null> {
    return fetchUserStatus<UserStatusResponse, UserStatus>(
      `${env.AUTH_SERVICE_BASE_URL}/internal/auth/users/${encodeURIComponent(userId)}/status`,
      userId,
    );
  },

  async getManagedUserStatus(userId: string): Promise<ManagedUserStatus | null> {
    return fetchUserStatus<ManagedUserStatusResponse, ManagedUserStatus>(
      `${env.AUTH_SERVICE_BASE_URL}/internal/auth/users/${encodeURIComponent(userId)}/managed-status`,
      userId,
    );
  },
};

async function fetchUserStatus<TResponse extends ApiSuccess<TUser> | ApiError, TUser>(
  url: string,
  userId: string,
): Promise<TUser | null> {
  try {
    const response = await axios.get<TResponse>(url, {
      timeout: env.AUTH_SERVICE_TIMEOUT_MS,
      validateStatus: () => true,
    });

    if (response.status === StatusCodes.OK && response.data.success) {
      return response.data.data;
    }

    if (response.status === StatusCodes.NOT_FOUND) {
      return null;
    }

    throwAuthServiceUnavailable({
      statusCode: response.status,
      response: response.data,
      url,
      userId,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throwAuthServiceUnavailable({
      error,
      url,
      userId,
    });
  }
}
