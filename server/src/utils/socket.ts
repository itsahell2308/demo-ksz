import express, { Express } from "express";
import http, { Server } from "http";
import { Server as SocketIOServer } from "socket.io";

export const app: Express = express();
export const httpServer: Server = http.createServer(app);
export const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:*"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  console.log("New Client is Connected!", socket.id);

  socket.on("disconnect", () => {
    console.log("Client Disconnected!", socket.id);
  });
});
