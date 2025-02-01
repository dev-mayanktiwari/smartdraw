import "@repo/types";
import { verifyToken } from "../jwt";
import { IncomingMessage } from "http";
import { TokenPayload } from "@repo/types";

export function wsMidddleware(
  ws: WebSocket,
  req: IncomingMessage,
  next: () => void
) {
  try {
    // Need to be fixed
    const urlParams = new URL(req.url as any, `http://${req.headers.host}`);
    const token = urlParams.searchParams.get("refreshToken");

    if (!token) {
      console.log("No token provided, Websocket server!!");
      ws.close(4001, "UNAUTHORIZED");
      return;
    }

    const payload = verifyToken<TokenPayload>(token);

    // Need to be fixec
    (ws as any).user = payload;

    next();
  } catch (error) {
    console.log("Error in authentication: WS Server", error);
    ws.close(4003, "Internal server error");
  }
}
