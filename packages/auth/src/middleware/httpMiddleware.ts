import "@repo/types";
import { Request, Response, NextFunction } from "express";
import { httpError } from "@repo/shared-utils";
import { verifyToken } from "../jwt";
import { ResponseMessage, StatusCodes, TokenPayload } from "@repo/types";

export const httpAuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.refreshToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return httpError(
        next,
        new Error(ResponseMessage.UNAUTHORIZED),
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    try {
      const payload = verifyToken<TokenPayload>(token);
      req.user = payload;
      next();
    } catch (error) {
      return httpError(
        next,
        error,
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }
  };
};
