import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpResponse } from "@repo/shared-utils";
import { StatusCodes } from "@repo/types";

export default {
  createRoom: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.CREATED,
        "Room created successfully"
      );
    }
  ),
};
