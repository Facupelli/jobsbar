import { Server as ServerIO } from "socket.io";
import { type Server as NetServer } from "http";
import type { NextApiRequest } from "next";
import { type NextApiResponseServerIO } from "~/types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  } else {
    console.log("socket already running");
  }
  res.end();
}
