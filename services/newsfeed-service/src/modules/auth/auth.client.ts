import type {
  ApiError,
  ApiSuccess,
  ManagedUserStatus,
  UserPublic,
  UserStatus,
} from '@community/contracts';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';

type UserStatusResponse = ApiSuccess<UserStatus> | ApiError;
type ManagedUserStatusResponse = ApiSuccess<ManagedUserStatus> | ApiError;

function toUserPublic(user: UserStatus): UserPublic {
  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name,
    profile: user.profile,
    createdAt: user.createdAt,
  };
}

export const authClient = {
  async findUsersPublicByIds(userIds: string[]): Promise<UserPublic[]> {
    if (userIds.length === 0) {
      return [];
    }

    const response = await axios.get<ApiSuccess<UserPublic[]>>(
      `${env.AUTH_SERVICE_BASE_URL}/internal/auth/users/public?ids=${encodeURIComponent(userIds.join(','))}`,
      {
        timeout: env.AUTH_SERVICE_TIMEOUT_MS,
        validateStatus: () => true,
      },
    );

    if (response.status >= StatusCodes.BAD_REQUEST || !response.data.success) {
      throw new Error(`Auth service request failed with status ${response.status}`);
    }

    return response.data.data;
  },

  async findUserPublicById(userId: string): Promise<UserPublic | null> {
    const response = await axios.get<UserStatusResponse>(
      `${env.AUTH_SERVICE_BASE_URL}/internal/auth/users/${encodeURIComponent(userId)}/status`,
      {
        timeout: env.AUTH_SERVICE_TIMEOUT_MS,
        validateStatus: () => true,
      },
    );

    if (response.status === StatusCodes.NOT_FOUND) {
      return null;
    }

    if (response.status >= StatusCodes.BAD_REQUEST || !response.data.success) {
      throw new Error(`Auth service request failed with status ${response.status}`);
    }

    return toUserPublic(response.data.data);
  },

  async getManagedUserStatus(userId: string): Promise<ManagedUserStatus | null> {
    const response = await axios.get<ManagedUserStatusResponse>(
      `${env.AUTH_SERVICE_BASE_URL}/internal/auth/users/${encodeURIComponent(userId)}/managed-status`,
      {
        timeout: env.AUTH_SERVICE_TIMEOUT_MS,
        validateStatus: () => true,
      },
    );

    if (response.status === StatusCodes.NOT_FOUND) {
      return null;
    }

    if (response.status >= StatusCodes.BAD_REQUEST || !response.data.success) {
      throw new Error(`Auth service request failed with status ${response.status}`);
    }

    return response.data.data;
  },
};
