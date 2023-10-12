import { chatMiddleware, chatSocket } from "@/chatSocket/chatSocket";
import { Express } from "express-serve-static-core";
import http from "http";
import { Server } from "socket.io";
import { gateSocket } from "./gateSocket";

export default function initSocket(app: Express) {
  console.log(`init socket`);

  const server = http.createServer(app);
  const io: Server = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const chatIo = io.of("/chat");

  io.on("connection", gateSocket);

  chatMiddleware(chatIo);
  chatIo.on("connection", chatSocket);

  return server;
}
