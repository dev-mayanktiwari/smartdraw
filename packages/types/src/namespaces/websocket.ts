import { WebSocket } from "ws";
import { TokenPayload } from "../jwt";

declare module "ws" {
  interface WebSocket {
    user?: TokenPayload;
  }
}

export {};
