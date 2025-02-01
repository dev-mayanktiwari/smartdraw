import { sign, SignOptions } from "jsonwebtoken";
import { TokenPayload } from "@repo/types";
import { PRIVATE_KEY } from "../keys";

export const createToken = (
  payload: TokenPayload,
  options: SignOptions = {
    algorithm: "RS256",
    expiresIn: "30d",
  }
): string => {
  return sign(payload, PRIVATE_KEY, options);
};
