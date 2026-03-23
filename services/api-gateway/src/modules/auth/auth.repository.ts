import type { Prisma, RefreshToken, User } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const authRepository = {
  findUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { mobileNumber } });
  },

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
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
