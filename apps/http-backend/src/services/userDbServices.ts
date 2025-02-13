import { prisma, type User, type Auth } from "@repo/db";
import { UserWithoutSensitiveInfo } from "@repo/types";

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
      username: true,
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

export const findUserByEmailorUsername = async (
  identifier: string
): Promise<Pick<
  User,
  "id" | "email" | "name" | "username" | "isVerified" | "password"
> | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      isVerified: true,
      password: true,
    },
  });
};

export const createNewUser = async (
  email: string,
  name: string,
  password: string,
  username: string,
  verificationToken: string,
  code: number
): Promise<UserWithoutSensitiveInfo> => {
  return prisma.user.create({
    data: {
      email,
      name,
      password,
      username,
      authProvider: "EMAIL",
      Auth: {
        create: {
          verifyToken: verificationToken,
          code,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
    },
  });
};

export const createNewGoogleUser = async (
  email: string,
  name: string,
  username: string,
  avatar: string,
  providerId: string
): Promise<UserWithoutSensitiveInfo> => {
  return prisma.user.upsert({
    where: {
      email,
    },
    update: {
      lastLoginAt: new Date(),
    },
    create: {
      email,
      name,
      avatar,
      authProvider: "GOOGLE",
      providerId,
      isVerified: true,
      lastLoginAt: new Date(),
      username,
    },
  });
};
