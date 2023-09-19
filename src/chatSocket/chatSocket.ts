import { chatSocketAction } from "@/constants/chatSocketActions";
import { Chat, IChat } from "@/models/ChatSocket/Chat";
import { Namespace, Socket } from "socket.io";

export function chatSocket(this: Namespace, socket: Socket) {
  const io: Namespace = this;

  console.log(`User connected chat`);

  socket.on(chatSocketAction.newMessage, async function newMessage(messageData: IChat, room?: string) {
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
  });

  socket.on(chatSocketAction.joinRoom, function joinRoom(room: string) {
    try {
      socket.join(room);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A disconnected chat");
  });
}
