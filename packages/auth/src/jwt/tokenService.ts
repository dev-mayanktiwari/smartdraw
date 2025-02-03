import { TokenPayload, Tokens } from "@repo/types";
import { sign, verify } from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../keys";

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "30m",
    });
  }

  static generateRefreshToken(payload: Pick<TokenPayload, "userId">): string {
    return sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "30d",
    });
  }

  static generateTokens(payload: TokenPayload): Tokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken({ userId: payload.userId }),
    };
  }

  static verifyToken(token: string): TokenPayload {
    return verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as TokenPayload;
  }
}
