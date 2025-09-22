// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
// socket singleton
export function getSocket(token: string, userId: number) {
  if (socket && socket.connected) return socket;
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],     // avoid long-polling -> fewer edge cases
      auth: { token, userId }
    });
  }
  return socket;
}
