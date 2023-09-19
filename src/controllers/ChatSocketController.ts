// User

import { chatSocketAction } from "@/constants/chatSocketActions";
import { Chat, IChat } from "@/models/ChatSocket/Chat";
import { Server, Socket } from "socket.io";

export function ChatSocketController(
  io: Server,
  socket: Socket
): {
  [k in keyof typeof chatSocketAction]: (...args: any[]) => void;
} {
  async function newMessage(messageData: IChat, room?: string) {
    try {
      const { sender, receiver, message } = messageData;
      const newMessage = new Chat({
        sender,
        receiver,
        message,
      });
      //   await newMessage.save();

      if (room) {
        socket.to(room).emit(chatSocketAction.newMessage, newMessage); // Broadcast to all connected clients
      } else {
        socket.broadcast.emit(chatSocketAction.newMessage, newMessage); // Broadcast to all connected clients
      }
    } catch (error) {
      console.error(error);
    }
  }
  function joinRoom(room: string) {
    try {
      socket.join(room);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    newMessage,
    joinRoom,
  };
}
