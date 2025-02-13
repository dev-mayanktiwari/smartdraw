import { httpError } from "@repo/shared-utils";
import {
  AuthenticatedRequest,
  ResponseMessage,
  StatusCodes,
} from "@repo/types";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "../jwt";
import jwt from "jsonwebtoken"; // Import JWT to check specific errors

export const httpMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return httpError(
        next,
        new Error("Authorization header missing or malformed"),
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = TokenService.verifyToken(token!);
      (req as AuthenticatedRequest).user = payload;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return httpError(
          next,
          new Error("Token has expired, please log in again"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        return httpError(
          next,
          new Error("Invalid token signature"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.FORBIDDEN
        );
      } else {
        return httpError(
          next,
          new Error("Token verification failed"),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST
        );
      }
    }
  } catch (error) {
    return httpError(
      next,
      error,
      req,
      StatusCodes.ERROR.SERVER_ERROR.INTERNAL_SERVER_ERROR
    );
  }
};
