import { Request } from "express";
import { TokenPayload } from "../jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
