// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// socket singleton
export function getSocket(token: string, userId: number) {
  if (socket && socket.connected) return socket;
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],     // avoid long-polling -> fewer edge cases
      auth: { token, userId }
    });
  }
  return socket;
}
