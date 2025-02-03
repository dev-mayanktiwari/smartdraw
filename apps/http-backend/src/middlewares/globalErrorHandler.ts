import { NextFunction, Request, Response } from "express";
import { THTTPError } from "../types";

export default (
  err: THTTPError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log("Error in global error handler", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    statusCode: err.statusCode || 500,
  });
};
