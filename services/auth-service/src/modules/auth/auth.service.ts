import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Prisma } from '@prisma/client';
import type { AuthResponse, AuthTokens, LoginRequest, RegisterRequest, UserProfile, UserPublic, UserStatus } from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { decodeTokenExpiration, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/token';
import { verifyPassword, hashPassword } from '../../lib/password';
import { AppError } from '../../shared/app-error';
import { authRepository } from './auth.repository';
import { buildUserImagePublicPath, resolveUserImagePublicPath, userImageUploadDir } from './user-image-storage';
import { detectUserImageMimeType, getUserImageExtension, toBase64DataUrl } from './user-image.utils';

const defaultUserProfile: UserProfile = {
  image: null,
};

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

async function toUserPublic(user: {
  id: string;
  mobileNumber: string;
  name: string;
  profile: Prisma.JsonValue | null;
  createdAt: Date;
}): Promise<UserPublic> {
  const profile = toUserProfile(user.profile);

  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name,
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

async function deleteFileIfPresent(filePath: string | null | undefined): Promise<void> {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function moveUploadedUserImage(userId: string, file: Express.UploadedUserImage): Promise<string> {
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

  async register(payload: RegisterRequest): Promise<AuthResponse> {
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
      profile: toStoredUserProfile(defaultUserProfile),
      passwordHash: await hashPassword(payload.password),
    });

    const tokens = await issueTokens(user);

    return {
      user: await toUserPublic(user),
      tokens,
    };
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const user = await authRepository.findUserByMobileNumber(payload.mobileNumber);

    if (!user || !user.isActive) {
      throw new AppError('Invalid mobile number or password', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Invalid mobile number or password', {
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

    if (!existingRefreshToken || existingRefreshToken.revokedAt || existingRefreshToken.expiresAt < new Date()) {
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

    const existingRefreshToken = await authRepository.findRefreshTokenByHash(hashToken(refreshToken));

    if (!existingRefreshToken || existingRefreshToken.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(existingRefreshToken.id);
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
