import type { ApiError, ApiSuccess, UserPublic, UserStatus } from '@community/contracts';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';

type UserStatusResponse = ApiSuccess<UserStatus> | ApiError;

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
};
