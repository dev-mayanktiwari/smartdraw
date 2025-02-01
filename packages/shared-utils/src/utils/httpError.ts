import { NextFunction, Request } from "express";
import { errorObject } from "./errorObject";

const httpError = (
  nextFunction: NextFunction,
  err: Error | unknown,
  req: Request,
  errorStatusCode: number = 500
): void => {
  const errorObj = errorObject(err, req, errorStatusCode);
  return nextFunction(errorObj);
};

export { httpError };
