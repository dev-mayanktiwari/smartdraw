import { prisma } from "@repo/db";
import { asyncErrorHandler, httpError, httpResponse } from "@repo/shared-utils";
import {
  ApplicationEnvirontment,
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
  findUserByVerificationCode,
  updateAccountVerificationStatus,
  updateLastLogin,
  updateRefreshToken,
  upsertRefreshToken,
} from "../services/userDbServices";

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

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          authProvider: "EMAIL",
          Auth: {
            create: {
              verifyToken: verificationToken,
            },
          },
        },
      });

      // TODO: SEND EMAIL

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

      if (!verifyToken) {
        httpError(
          next,
          new Error("No token provided"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      const user = await findUserByVerificationCode(verifyToken as string);

      if (!user) {
        httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
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

      await updateAccountVerificationStatus(user?.userId!);

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

  handleGoogleCallback: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as any;

      const { accessToken, refreshToken } = TokenService.generateTokens({
        userId: user?.id,
        email: user?.email,
        name: user?.name,
      });

      await upsertRefreshToken(user?.id, refreshToken);
      await updateLastLogin(user?.id);

      res.cookie("refreshToken", refreshToken, {
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
