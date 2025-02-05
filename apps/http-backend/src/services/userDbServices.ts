import { prisma, type User, type Auth } from "@repo/db";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const addResetTokenAndExpiry = async (
  userId: string,
  token: string,
  expiry: string
) => {
  return prisma.auth.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      verifyToken: token,
      expiryTime: expiry,
    },
    update: {
      verifyToken: token,
      expiryTime: expiry,
    },
  });
};

export const updateLastLogin = async (userId: string): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
};

export const findUserByIdWithouthPassword = async (
  userId: string
): Promise<Omit<
  User,
  | "password"
  | "isActive"
  | "authProvider"
  | "providerId"
  | "createdAt"
  | "updatedAt"
> | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      authProvider: true,
      isVerified: true,
      lastLoginAt: true,
    },
  });
};

export const updateRefreshToken = async (
  userId: string,
  refreshToken: string | null
): Promise<Auth> => {
  return prisma.auth.update({
    where: { userId },
    data: { refreshToken },
  });
};

export const findUserByResetToken = async (
  resetToken: string
): Promise<Auth | null> => {
  return prisma.auth.findUnique({
    where: { verifyToken: resetToken },
  });
};

export const findUserByUserID = async (
  userId: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

export const clearResetTokenAndExpiry = async (
  userId: string
): Promise<Auth> => {
  return prisma.auth.update({
    where: { userId },
    data: { verifyToken: null, expiryTime: null },
  });
};

export const updatePassword = async (
  userId: string,
  password: string
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { password },
  });
};

export const findUserByVerificationCodeAndToken = async (
  verificationCode: string,
  token: number
): Promise<Auth | null> => {
  return prisma.auth.findUnique({
    where: { verifyToken: verificationCode, code: token },
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
