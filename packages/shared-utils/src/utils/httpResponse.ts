import { Request, Response } from "express";
import { THTTPResponse } from "@repo/types";
import { ApplicationEnvirontment } from "@repo/types";
import { TApplicationEnvirontment } from "@repo/types";
import { logger } from "./logger";

const httpResponse = (
  req: Request,
  res: Response,
  responseStatusCode: number,
  responseMessage: string,
  data: unknown = null,
  env: TApplicationEnvirontment = "development"
) => {
  const response: THTTPResponse = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
    },
    message: responseMessage,
    data: data,
  };

  logger.info(`Controller Response`, {
    meta: response,
  });

  //Production env check
  if (env === ApplicationEnvirontment.PRODUCTION) {
    delete response.request.ip;
  }

  res.status(responseStatusCode).json(response);
};

export { httpResponse };
