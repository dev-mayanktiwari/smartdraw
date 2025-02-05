import { httpError } from "@repo/shared-utils";
import {
  AuthenticatedRequest,
  ResponseMessage,
  StatusCodes,
} from "@repo/types";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "../jwt";

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
        new Error(ResponseMessage.TOKEN_ERROR),
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = TokenService.verifyToken(token!);
    (req as AuthenticatedRequest).user = payload;

    next();
  } catch (error) {
    return httpError(
      next,
      error,
      req,
      StatusCodes.ERROR.SERVER_ERROR.INTERNAL_SERVER_ERROR
    );
  }
};
