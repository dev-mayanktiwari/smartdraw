import "@repo/types";
import { IncomingMessage } from "http";
import {
  AuthenticatedWebSocket,
  ResponseMessage,
  WSStatusCodes,
} from "@repo/types";
import { WSError } from "@repo/shared-utils";
import { TokenService } from "../jwt";

export function wsMidddleware(
  ws: WebSocket,
  req: IncomingMessage,
  next: () => void
) {
  try {
    const host = req.headers.host || "localhost";
    const urlString = req.url || "";
    const urlParams = new URL(urlString, `http://${host}`);

    const token = urlParams.searchParams.get("accessToken");

    if (!token) {
      throw new WSError(
        WSStatusCodes.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED
      );
    }

    const payload = TokenService.verifyToken(token);

    // Need to be fixec
    (ws as AuthenticatedWebSocket).user = payload;

    next();
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

    ws.close(wsError.code, wsError.message);
  }
}
