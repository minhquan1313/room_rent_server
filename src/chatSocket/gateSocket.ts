import { Server, Socket } from "socket.io";

export function gateSocket(this: Server, socket: Socket) {
  const io: Server = this;
  console.log("A user connected");

  // const chatSocketController = ChatSocketController(io, socket);
  // Listen for new messages and broadcast them
  // socket.on(chatSocketAction.newMessage, chatSocketController.newMessage);
  // socket.on(chatSocketAction.joinRoom, chatSocketController.joinRoom);
  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}
