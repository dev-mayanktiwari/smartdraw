import { WebSocketServer } from "ws";
import { wsMidddleware } from "@repo/auth";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  wsMidddleware(ws, request, (err) => {
    if (err) {
      console.log("Websocket authentication failed", err.message);
      ws.close(err.code, err.message);
      return;
    }
    console.log("Websocket authenticated");
    ws.on("message", (message) => {
      console.log("received: %s", message);
      ws.send(`Hello, you sent -> ${message}`);
    });
  });
});

console.log("WebSocket server started on ws://localhost:8080");
