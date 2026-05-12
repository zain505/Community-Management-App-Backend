import type { Prisma, RefreshToken, User } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';

type ManagedUserRecord = Pick<User, 'id' | 'mobileNumber' | 'name' | 'usertype' | 'profile' | 'isActive' | 'createdAt'>;

export const authRepository = {
  findUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { mobileNumber } });
  },

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findUsersByIds(ids: string[]): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  },

  findAllUsers(): Promise<ManagedUserRecord[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        mobileNumber: true,
        name: true,
        usertype: true,
        profile: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  updateUserProfile(id: string, profile: Prisma.InputJsonValue): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { profile },
    });
  },

  updateUserName(id: string, name: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { name },
    });
  },

  updateUserActiveStatus(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  },

  async updateUserPasswordHashAndRevokeTokens(options: {
    userId: string;
    passwordHash: string;
  }): Promise<User> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedUser = await tx.user.update({
        where: { id: options.userId },
        data: { passwordHash: options.passwordHash },
      });

      await tx.refreshToken.updateMany({
        where: {
          userId: options.userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      return updatedUser;
    });
  },

  createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  },

  findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },

  revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  },

  revokeActiveRefreshTokensByUserId(userId: string): Promise<Prisma.BatchPayload> {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  },

  async rotateRefreshToken(options: {
    currentTokenId: string;
    newTokenHash: string;
    newExpiresAt: Date;
    userId: string;
  }): Promise<RefreshToken> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.refreshToken.update({
        where: { id: options.currentTokenId },
        data: { revokedAt: new Date() },
      });

      return tx.refreshToken.create({
        data: {
          tokenHash: options.newTokenHash,
          expiresAt: options.newExpiresAt,
          userId: options.userId,
        },
      });
    });
  },
};
