// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

// const BASE_URL = "http://localhost:3000"; // for local dev

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
