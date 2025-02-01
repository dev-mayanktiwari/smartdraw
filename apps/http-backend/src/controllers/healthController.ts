import { Request, Response } from "express";
import { asyncErrorHandler, httpResponse } from "@repo/shared-utils";
import quicker from "../utils/quicker";
import dayjs from "dayjs";
import { createToken } from "@repo/auth";
import { StatusCodes } from "@repo/types";

export default {
  self: asyncErrorHandler(async (req: Request, res: Response) => {
    httpResponse(req, res, StatusCodes.SUCCESS.OK, "Hello World", {
      name: "Mayank Tiwari",
    });
  }),

  health: asyncErrorHandler(async (req: Request, res: Response) => {
    const healthData = {
      application: quicker.getApplicationHealth(),
      system: quicker.getSystemHealth(),
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    httpResponse(req, res, StatusCodes.SUCCESS.OK, "Health Check", healthData);
  }),

  generateToken: asyncErrorHandler(async (req: Request, res: Response) => {
    const user = {
      userId: "mayank",
      email: "Hello",
    };
    const token = createToken(user);
    httpResponse(req, res, StatusCodes.SUCCESS.OK, "Health Check", token);
  }),
};
