import { prisma, type User, type Auth } from "@repo/db";

export const updateLastLogin = async (userId: string): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
};

export const updateRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<Auth> => {
  return prisma.auth.update({
    where: { userId },
    data: { refreshToken },
  });
};

export const findUserByVerificationCode = async (
  verificationCode: string
): Promise<Auth | null> => {
  return prisma.auth.findUnique({
    where: { verifyToken: verificationCode },
  });
};

export const updateAccountVerificationStatus = async (
  userId: string
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};

export const upsertRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<Auth> => {
  return prisma.auth.upsert({
    where: { userId },
    update: {
      refreshToken,
    },
    create: {
      userId,
      refreshToken,
    },
  });
};
