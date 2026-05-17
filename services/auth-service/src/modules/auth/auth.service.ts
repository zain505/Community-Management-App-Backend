import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Prisma } from '../../generated/prisma';
import type {
  AdminResetUserPasswordResponse,
  AuthResponse,
  AuthTokens,
  DeleteUserResponse,
  LoginRequest,
  ManagedUserStatus,
  PasswordChangeResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  UserPublic,
  UserStatus,
  UserType,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../config/logger';
import {
  decodeTokenExpiration,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../lib/token';
import { verifyPassword, hashPassword } from '../../lib/password';
import { AppError } from '../../shared/app-error';
import { authRepository } from './auth.repository';
import {
  buildUserImagePublicPath,
  resolveUserImagePublicPath,
  userImageUploadDir,
} from './user-image-storage';
import {
  detectUserImageMimeType,
  getUserImageExtension,
  toBase64DataUrl,
} from './user-image.utils';

const defaultUserProfile: UserProfile = {
  image: null,
};
const invalidCredentialsMessage = 'Invalid mobile number, password, or user type';
const reservedAdminNamePattern = /\b(?:super\s+admin|admin)\b/i;

function toUserProfile(profile: Prisma.JsonValue | null | undefined): UserProfile {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return defaultUserProfile;
  }

  const image = 'image' in profile && typeof profile.image === 'string' ? profile.image : null;

  return {
    image,
  };
}

function toStoredUserProfile(profile: UserProfile): Prisma.InputJsonValue {
  return {
    image: profile.image,
  };
}

function normalizeNameForPolicyCheck(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

async function resolveUserImageForResponse(image: string | null): Promise<string | null> {
  if (!image) {
    return null;
  }

  if (image.startsWith('data:')) {
    return image;
  }

  const resolvedImagePath = resolveUserImagePublicPath(image);

  if (!resolvedImagePath) {
    return image;
  }

  try {
    const buffer = await fs.readFile(resolvedImagePath);
    const mimetype = detectUserImageMimeType(buffer);

    if (!mimetype) {
      return image;
    }

    return toBase64DataUrl(buffer, mimetype);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === 'ENOENT') {
      return image;
    }

    throw error;
  }
}

type AuthUserPublic = UserPublic & { usertype: UserType };

async function toUserPublic(user: {
  id: string;
  mobileNumber: string;
  name: string;
  usertype: number;
  profile: Prisma.JsonValue | null;
  createdAt: Date;
}): Promise<AuthUserPublic> {
  const profile = toUserProfile(user.profile);

  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name,
    usertype: user.usertype as UserType,
    profile: {
      image: await resolveUserImageForResponse(profile.image),
    },
    createdAt: user.createdAt.toISOString(),
  };
}

function toUserStatus(user: {
  id: string;
  mobileNumber: string;
  name: string;
  profile: Prisma.JsonValue | null;
  isActive: boolean;
  createdAt: Date;
}): UserStatus {
  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name,
    profile: toUserProfile(user.profile),
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

function toManagedUserStatus(user: {
  id: string;
  mobileNumber: string;
  name: string;
  usertype: number;
  profile: Prisma.JsonValue | null;
  isActive: boolean;
  createdAt: Date;
}): ManagedUserStatus {
  return {
    ...toUserStatus(user),
    usertype: user.usertype as UserType,
  };
}

async function deleteFileIfPresent(filePath: string | null | undefined): Promise<void> {
  if (!filePath) {
    return;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        return;
      }

      if (!['EBUSY', 'EPERM'].includes(nodeError.code ?? '') || attempt === 4) {
        throw error;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }
  }
}

async function moveUploadedUserImage(
  userId: string,
  file: Express.UploadedUserImage,
): Promise<string> {
  const extension = getUserImageExtension(file.mimetype);
  const fileName = `${userId}-${Date.now()}-${randomUUID()}${extension}`;
  const destinationPath = path.join(userImageUploadDir, fileName);

  await fs.mkdir(userImageUploadDir, { recursive: true });
  await fs.rename(file.filepath, destinationPath);

  return buildUserImagePublicPath(fileName);
}

async function deletePreviousUserImageIfManaged(publicPath: string | null): Promise<void> {
  if (!publicPath) {
    return;
  }

  const existingFilePath = resolveUserImagePublicPath(publicPath);

  if (!existingFilePath) {
    return;
  }

  await deleteFileIfPresent(existingFilePath);
}

async function deleteManagedUserImageAfterUserDeletion(
  userId: string,
  publicPath: string | null,
): Promise<void> {
  try {
    await deletePreviousUserImageIfManaged(publicPath);
  } catch (error) {
    logger.warn(
      {
        err: error,
        userId,
        publicPath,
      },
      'Failed to delete managed user image after user deletion',
    );
  }
}

async function ensureActiveSuperAdmin(requesterId: string, action: string): Promise<void> {
  const requester = await authRepository.findUserById(requesterId);

  if (!requester || !requester.isActive || requester.usertype !== 0) {
    throw new AppError(`Only active super admins can ${action}`, {
      statusCode: StatusCodes.FORBIDDEN,
      code: 'SUPER_ADMIN_REQUIRED',
    });
  }
}

function assertNameAllowedForUser(name: string, usertype: number): void {
  if (usertype === 2 && reservedAdminNamePattern.test(normalizeNameForPolicyCheck(name))) {
    throw new AppError('Normal users cannot use reserved admin words in their name', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'INVALID_USER_NAME',
    });
  }
}

async function issueTokens(user: { id: string; mobileNumber: string }): Promise<AuthTokens> {
  const accessToken = signAccessToken({
    sub: user.id,
    mobileNumber: user.mobileNumber,
  });

  const refresh = signRefreshToken({
    sub: user.id,
    mobileNumber: user.mobileNumber,
  });

  await authRepository.createRefreshToken({
    tokenHash: hashToken(refresh.token),
    expiresAt: decodeTokenExpiration(refresh.token),
    userId: user.id,
  });

  return {
    accessToken,
    refreshToken: refresh.token,
  };
}

export const authService = {
  async getUserStatus(userId: string): Promise<UserStatus> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    return toUserStatus(user);
  },

  async getManagedUserStatus(userId: string): Promise<ManagedUserStatus> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    return toManagedUserStatus(user);
  },

  async listUsersPublicByIds(userIds: string[]): Promise<UserPublic[]> {
    if (userIds.length === 0) {
      return [];
    }

    const users = await authRepository.findUsersByIds(userIds);
    const usersById = new Map(users.map((user) => [user.id, user]));

    return Promise.all(
      userIds
        .map((userId) => usersById.get(userId))
        .filter((user): user is NonNullable<typeof user> => Boolean(user))
        .map((user) => toUserPublic(user)),
    );
  },

  async listAllUsers(requesterId: string): Promise<ManagedUserStatus[]> {
    await ensureActiveSuperAdmin(requesterId, 'view all users');

    const users = await authRepository.findAllUsers();

    return users.map((user) => toManagedUserStatus(user));
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const existing = await authRepository.findUserByMobileNumber(payload.mobileNumber);

    if (existing) {
      throw new AppError('Mobile phone number is already in use', {
        statusCode: StatusCodes.CONFLICT,
        code: 'MOBILE_PHONE_IN_USE',
      });
    }

    const user = await authRepository.createUser({
      mobileNumber: payload.mobileNumber,
      name: payload.name,
      usertype: payload.usertype,
      profile: toStoredUserProfile(defaultUserProfile),
      passwordHash: await hashPassword(payload.password),
      isActive: false,
    });

    if (!user.isActive) {
      return {
        user: toManagedUserStatus(user),
        requiresActivation: true,
      };
    }

    const tokens = await issueTokens(user);

    return {
      user: toManagedUserStatus(user),
      tokens,
      requiresActivation: false,
    };
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const user = await authRepository.findUserByMobileNumber(payload.mobileNumber);

    if (!user || !user.isActive) {
      throw new AppError(invalidCredentialsMessage, {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatches || user.usertype !== payload.usertype) {
      throw new AppError(invalidCredentialsMessage, {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const tokens = await issueTokens(user);

    return {
      user: await toUserPublic(user),
      tokens,
    };
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenPayload = verifyRefreshToken(refreshToken);
    const userId = tokenPayload.sub;

    if (typeof userId !== 'string') {
      throw new AppError('Invalid refresh token', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    const hashedToken = hashToken(refreshToken);
    const existingRefreshToken = await authRepository.findRefreshTokenByHash(hashedToken);

    if (
      !existingRefreshToken ||
      existingRefreshToken.revokedAt ||
      existingRefreshToken.expiresAt < new Date()
    ) {
      throw new AppError('Refresh token is invalid or expired', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    const user = await authRepository.findUserById(userId);

    if (!user || !user.isActive) {
      throw new AppError('User is not active', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'USER_INACTIVE',
      });
    }

    const accessToken = signAccessToken({
      sub: user.id,
      mobileNumber: user.mobileNumber,
    });
    const rotatedRefresh = signRefreshToken({
      sub: user.id,
      mobileNumber: user.mobileNumber,
    });

    await authRepository.rotateRefreshToken({
      currentTokenId: existingRefreshToken.id,
      newTokenHash: hashToken(rotatedRefresh.token),
      newExpiresAt: decodeTokenExpiration(rotatedRefresh.token),
      userId: user.id,
    });

    return {
      user: await toUserPublic(user),
      tokens: {
        accessToken,
        refreshToken: rotatedRefresh.token,
      },
    };
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    const existingRefreshToken = await authRepository.findRefreshTokenByHash(
      hashToken(refreshToken),
    );

    if (!existingRefreshToken || existingRefreshToken.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(existingRefreshToken.id);
  },

  async changePassword(params: {
    requesterId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<PasswordChangeResponse> {
    const user = await authRepository.findUserById(params.requesterId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    if (params.currentPassword === params.newPassword) {
      throw new AppError('New password must be different from current password', {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'NEW_PASSWORD_MUST_DIFFER',
      });
    }

    const passwordMatches = await verifyPassword(params.currentPassword, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Current password is incorrect', {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'INVALID_CURRENT_PASSWORD',
      });
    }

    await authRepository.updateUserPasswordHashAndRevokeTokens({
      userId: user.id,
      passwordHash: await hashPassword(params.newPassword),
    });

    return {
      message: 'Password changed successfully',
    };
  },

  async resetUserPasswordByMobileNumber(params: {
    requesterId: string;
    mobileNumber: string;
    newPassword: string;
  }): Promise<AdminResetUserPasswordResponse> {
    await ensureActiveSuperAdmin(params.requesterId, 'reset user passwords');

    const user = await authRepository.findUserByMobileNumber(params.mobileNumber);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    const passwordMatches = await verifyPassword(params.newPassword, user.passwordHash);

    if (passwordMatches) {
      throw new AppError('New password must be different from current password', {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'NEW_PASSWORD_MUST_DIFFER',
      });
    }

    const updatedUser = await authRepository.updateUserPasswordHashAndRevokeTokens({
      userId: user.id,
      passwordHash: await hashPassword(params.newPassword),
    });

    return {
      message: 'Password reset successfully',
      mobileNumber: updatedUser.mobileNumber,
    };
  },

  async updateUserActivation(params: {
    requesterId: string;
    userId: string;
    isActive: boolean;
  }): Promise<UserStatus> {
    await ensureActiveSuperAdmin(params.requesterId, 'update account activation');

    const user = await authRepository.findUserById(params.userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    const updatedUser = await authRepository.updateUserActiveStatus(params.userId, params.isActive);

    if (!params.isActive) {
      await authRepository.revokeActiveRefreshTokensByUserId(params.userId);
    }

    return toUserStatus(updatedUser);
  },

  async deleteUserAccount(params: {
    requesterId: string;
    userId: string;
  }): Promise<DeleteUserResponse> {
    await ensureActiveSuperAdmin(params.requesterId, 'delete user accounts');

    if (params.requesterId === params.userId) {
      throw new AppError('Super admins cannot delete their own account', {
        statusCode: StatusCodes.FORBIDDEN,
        code: 'SELF_DELETE_FORBIDDEN',
      });
    }

    const user = await authRepository.findUserById(params.userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    const profile = toUserProfile(user.profile);
    await authRepository.deleteUserById(user.id);
    await deleteManagedUserImageAfterUserDeletion(user.id, profile.image);

    return {
      id: user.id,
      message: 'User account deleted',
    };
  },

  async updateUserName(params: {
    requesterId: string;
    userId: string;
    name: string;
  }): Promise<UserPublic> {
    if (params.requesterId !== params.userId) {
      throw new AppError('You can only update your own name', {
        statusCode: StatusCodes.FORBIDDEN,
        code: 'USER_NAME_FORBIDDEN',
      });
    }

    const user = await authRepository.findUserById(params.userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    assertNameAllowedForUser(params.name, user.usertype);

    const updatedUser = await authRepository.updateUserName(user.id, params.name.trim());

    return await toUserPublic(updatedUser);
  },

  async updateUserImage(params: {
    requesterId: string;
    userId: string;
    file: Express.UploadedUserImage;
  }): Promise<UserPublic> {
    if (params.requesterId !== params.userId) {
      throw new AppError('You can only update your own profile image', {
        statusCode: StatusCodes.FORBIDDEN,
        code: 'USER_IMAGE_FORBIDDEN',
      });
    }

    const user = await authRepository.findUserById(params.userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    }

    const currentProfile = toUserProfile(user.profile);
    let storedImagePath: string | null = null;

    try {
      storedImagePath = await moveUploadedUserImage(user.id, params.file);

      const updatedUser = await authRepository.updateUserProfile(
        user.id,
        toStoredUserProfile({
          ...currentProfile,
          image: storedImagePath,
        }),
      );

      await deletePreviousUserImageIfManaged(currentProfile.image);

      return await toUserPublic(updatedUser);
    } catch (error) {
      if (storedImagePath) {
        await deleteFileIfPresent(resolveUserImagePublicPath(storedImagePath));
      } else {
        await deleteFileIfPresent(params.file.filepath);
      }

      throw error;
    }
  },
};
