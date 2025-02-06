import { prisma } from "@repo/db";
import {
  asyncErrorHandler,
  httpError,
  httpResponse,
  logger,
} from "@repo/shared-utils";
import {
  ApplicationEnvirontment,
  AuthenticatedRequest,
  ChangePasswordSchema,
  ForgotUserSchema,
  ResetPasswordSchema,
  ResponseMessage,
  StatusCodes,
  UserLoginInput,
  UserRegisterInput,
} from "@repo/types";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppConfig } from "../config";
import quicker from "../utils/quicker";
import { TokenService } from "@repo/auth";
import {
  addResetTokenAndExpiry,
  clearResetTokenAndExpiry,
  findUserByEmail,
  findUserByIdWithouthPassword,
  findUserByResetToken,
  findUserByUserID,
  findUserByVerificationCodeAndToken,
  updateAccountVerificationStatus,
  updateLastLogin,
  updatePassword,
  updateRefreshToken,
  upsertRefreshToken,
} from "../services/userDbServices";
import {
  sendPasswordChangeConfirmationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@repo/queue";
import dayjs from "dayjs";

export default {
  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;

      const safeParse = UserRegisterInput.safeParse(body);
      if (!safeParse.success) {
        // const formatted = safeParse.error.format();
        return httpError(
          next,
          new Error(ResponseMessage.INVALID_INPUT),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const { email, name, password } = safeParse.data;

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      //   console.log(existingUser);
      if (existingUser) {
        return httpError(
          next,
          new Error(ResponseMessage.ENTITY_EXIST),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number(AppConfig.get("SALTROUNDS"))
      );

      const verificationToken = quicker.generateVerifyToken();
      const code = quicker.generateCode(6);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          authProvider: "EMAIL",
          Auth: {
            create: {
              verifyToken: verificationToken,
              code: code,
            },
          },
        },
      });

      await sendVerificationEmail(email, name, verificationToken, String(code));

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.CREATED,
        ResponseMessage.USER_CREATED,
        {
          user: newUser,
          verificationToken: verificationToken,
        }
      );
    }
  ),

  verifyEmail: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const verifyToken = req.query.token;
      const code = req.query.code;

      if (!verifyToken || !code) {
        httpError(
          next,
          new Error("No token provided"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      const auth = await findUserByVerificationCodeAndToken(
        verifyToken as string,
        Number(code)
      );

      if (!auth) {
        httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: auth?.userId,
        },
      });

      if (user?.isVerified) {
        return httpResponse(
          req,
          res,
          StatusCodes.SUCCESS.OK,
          "Account already verified"
        );
      }

      //   if (verifyToken != user?.verifyToken) {
      //     httpError(
      //       next,
      //       new Error(ResponseMessage.UNAUTHORIZED),
      //       req,
      //       StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
      //     );
      //   }

      await updateAccountVerificationStatus(auth?.userId!);
      await sendWelcomeEmail(user?.email!, user?.name!);

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.OK,
        "Account verified successfully"
      );
    }
  ),

  login: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;

      const safeParse = UserLoginInput.safeParse(body);
      if (!safeParse.success) {
        // const formatted = safeParse.error.format();
        return httpError(
          next,
          new Error(ResponseMessage.INVALID_INPUT),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const { email, password } = safeParse.data;

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
          isActive: true,
        },
      });

      if (!existingUser) {
        return httpError(
          next,
          new Error(ResponseMessage.LOGIN_UNSUCCESSFUL),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      }

      if (!existingUser.isVerified) {
        return httpError(
          next,
          new Error("Please verify you account to continue"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password!
      );

      if (!isPasswordCorrect) {
        return httpError(
          next,
          new Error(ResponseMessage.LOGIN_UNSUCCESSFUL),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      }

      const payload = {
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      };

      const { accessToken, refreshToken } =
        TokenService.generateTokens(payload);

      const _ = await updateLastLogin(existingUser.id);
      const __ = await updateRefreshToken(existingUser.id, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        path: "/api/v1/",
        domain: String(AppConfig.get("COOKIE_DOMAIN")),
        httpOnly: true,
        secure: AppConfig.get("ENV") === ApplicationEnvirontment.PRODUCTION,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.CREATED,
        ResponseMessage.LOGIN_SUCCESS,
        {
          accesstoken: `Bearer ${accessToken}`,
        }
      );
    }
  ),

  forgotPassword: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const safeParse = ForgotUserSchema.safeParse(body);

      if (!safeParse.success) {
        // const formatted = safeParse.error.format();
        return httpError(
          next,
          new Error(ResponseMessage.INVALID_INPUT),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const user = await findUserByEmail(safeParse.data.email);

      if (!user) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.NOT_FOUND
        );
      }

      const expiryTime = await quicker.generateExpiryTime(15);
      const token = quicker.generateVerifyToken();
      await addResetTokenAndExpiry(user?.id!, token, expiryTime);

      await sendPasswordResetEmail(user?.email!, user?.name!, token);

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.OK,
        "Reset link sent to your email"
      );
    }
  ),

  resetPassword: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const { token } = req.query;

      const safeParse = ResetPasswordSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error(ResponseMessage.INVALID_INPUT),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const tokenData = await findUserByResetToken(token as string);
      if (!tokenData) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.NOT_FOUND
        );
      }

      const user = await findUserByUserID(tokenData.userId);

      if (!user?.isVerified || !user?.isActive) {
        return httpError(
          next,
          new Error("User not verified or account deactivated"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      }

      const initExpiryTime = dayjs(tokenData.expiryTime);
      const currentTime = dayjs();
      const diff = currentTime.diff(initExpiryTime, "minute");

      if (diff > 15) {
        return httpError(
          next,
          new Error("Reset link expired"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      const currentPassword = user.password;
      const arepasswordSame = await bcrypt.compare(
        safeParse.data.newPassword,
        currentPassword!
      );

      if (arepasswordSame) {
        return httpError(
          next,
          new Error("New password cannot be same as previous password"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(
        safeParse.data.newPassword,
        Number(AppConfig.get("SALTROUNDS"))
      );

      await updatePassword(user.id!, hashedPassword);
      await clearResetTokenAndExpiry(user.id!);

      await sendPasswordChangeConfirmationEmail(user.email!, user.name!);

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.OK,
        "Password reset successfully"
      );
    }
  ),

  changePassword: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body, user } = req as AuthenticatedRequest;

      const safeParse = ChangePasswordSchema.safeParse(body);
      if (!safeParse) {
        return httpError(
          next,
          new Error(ResponseMessage.INVALID_INPUT),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const dbUser = await findUserByUserID(user?.userId!);
      if (!dbUser) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.NOT_FOUND
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        safeParse.data?.currentPassword!,
        dbUser.password!
      );

      if (!isPasswordCorrect) {
        return httpError(
          next,
          new Error("Current password is incorrect"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      }

      const arepasswordSame = await bcrypt.compare(
        safeParse.data?.newPassword!,
        dbUser.password!
      );

      if (arepasswordSame) {
        return httpError(
          next,
          new Error("New password cannot be same as previous password"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(
        safeParse.data?.newPassword!,
        Number(AppConfig.get("SALTROUNDS"))
      );

      await updatePassword(user?.userId!, hashedPassword);

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.OK,
        "Password changed successfully"
      );
    }
  ),

  logout: asyncErrorHandler(async (req: Request, res: Response) => {
    const { cookies, user } = req as AuthenticatedRequest;
    const { refreshToken } = cookies as { refreshToken: string | undefined };
    const clearAuthCookies = () => {
      const cookieOptions = {
        path: "/api/v1/",
        domain: String(AppConfig.get("COOKIE_DOMAIN")),
        sameSite: "lax" as const,
        httpOnly: true,
        secure: AppConfig.get("ENV") === ApplicationEnvirontment.PRODUCTION,
      };

      res.clearCookie("refreshToken", cookieOptions);
    };

    if (refreshToken) {
      await updateRefreshToken(user?.userId!, null);
    }

    clearAuthCookies();

    return httpResponse(
      req,
      res,
      StatusCodes.SUCCESS.OK,
      ResponseMessage.LOGOUT_SUCCESS
    );
  }),

  refreshToken: asyncErrorHandler(async (req: Request, res: Response) => {
    const { cookies } = req;
    const { refreshToken } = cookies as { refreshToken: string | undefined };

    if (!refreshToken) {
      return httpResponse(
        req,
        res,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED
      );
    }

    const payload = TokenService.verifyToken(refreshToken);

    if (!payload) {
      return httpResponse(
        req,
        res,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED
      );
    }

    const user = await findUserByUserID(payload.userId);

    if (!user) {
      return httpResponse(
        req,
        res,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED
      );
    }

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return httpResponse(
      req,
      res,
      StatusCodes.SUCCESS.OK,
      "Token refreshed successfully",
      {
        accessToken: `Bearer ${accessToken}`,
      }
    );
  }),

  self: asyncErrorHandler(async (req: Request, res: Response) => {
    const { user } = req as AuthenticatedRequest;
    const dbUser = await findUserByIdWithouthPassword(user?.userId!);

    return httpResponse(req, res, StatusCodes.SUCCESS.OK, "User data", {
      dbUser,
    });
  }),

  handleGoogleCallback: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as any;

      // console.log(user);

      const { accessToken, refreshToken } = TokenService.generateTokens({
        userId: user?.id,
        email: user?.email,
        name: user?.name,
      });

      await upsertRefreshToken(user?.id, refreshToken);

      // console.log("User from callback", user);

      const isWelcomeEmailNeeded =
        user.createdAt.getTime() === user.updatedAt.getTime();
      // console.log(isWelcomeEmailNeeded);

      if (isWelcomeEmailNeeded) {
        logger.info("Sending welcome mail...", {
          meta: {
            email: user.email,
            name: user.name,
          },
        });
        await sendWelcomeEmail(user?.email, user?.name);
      }

      res.cookie("refreshToken", refreshToken, {
        path: "/api/v1/",
        domain: AppConfig.get("COOKIE_DOMAIN") as string,
        httpOnly: true,
        secure: AppConfig.get("ENV") === ApplicationEnvirontment.PRODUCTION,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.CREATED,
        ResponseMessage.LOGIN_SUCCESS,
        {
          accesstoken: `Bearer ${accessToken}`,
        }
      );
    }
  ),
};
