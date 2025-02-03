import { TokenPayload } from "../jwt";

export interface AuthenticatedWebSocket extends WebSocket {
  user: TokenPayload;
}
