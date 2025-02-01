import { verify } from "jsonwebtoken";
import { PUBLIC_KEY } from "../keys";

export const verifyToken = <T = any>(token: string): T => {
  return verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }) as T;
};
