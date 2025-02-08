import "@repo/types";
import { WebSocket as WSWebSocket } from "ws";
import { IncomingMessage } from "http";
import { ResponseMessage, WSStatusCodes } from "@repo/types";
import { WSError } from "@repo/shared-utils";
import { TokenService } from "../jwt";

interface ExtendedWebSocket extends WSWebSocket {
  user?: any;
}

export const wsMidddleware = (
  ws: ExtendedWebSocket,
  request: IncomingMessage,
  next: (err?: WSError | null) => void
) => {
  try {
    const host = request.headers.host || "localhost";
    const urlString = request.url || "";
    const urlParams = new URL(urlString, `http://${host}`);

    const token = urlParams.searchParams.get("accessToken");

    if (!token) {
      throw new WSError(
        WSStatusCodes.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED
      );
    }

    const payload = TokenService.verifyToken(token);

    ws.user = payload;

    next(null);
  } catch (error) {
    const wsError =
      error instanceof WSError
        ? error
        : new WSError(
            WSStatusCodes.INTERNAL_ERROR,
            ResponseMessage.INTERNAL_SERVER_ERROR
          );

    console.error(
      `Websocket Authentication error: ${wsError.message}`,
      error instanceof Error ? error.stack : error
    );

    return next(wsError);
  }
};
