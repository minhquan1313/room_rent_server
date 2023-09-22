import { chatSocketAction } from "@/constants/chatSocketActions";
import { IChatMessage } from "@/models/ChatSocket/ChatMessage";
import { IUser } from "@/models/User/User";
import ChatSocketService from "@/services/ChatSocketService";
import LoginTokenService from "@/services/LoginTokenService";
import { IChatMessagePayload } from "@/types/IChatMessagePayload";
import { IChatMessageWithSeen, TChatList } from "@/types/TChatList";
import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface SocketData {
  user: IUser;
}

export function chatSocket(this: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) {
  const io = this;
  console.log(`User connected chat ${socket.data?.user?._id}`);

  // Middleware check id
  io.use(async (s, next) => {
    const { token } = s.handshake.auth;

    if (!token) {
      const error = new Error(`Missing token`);
      console.error(`🚀 ~ io.use ~ error:`, error);

      return next(error);
    }

    const user = await LoginTokenService.getUserByToken(token);

    if (!user) {
      const error = new Error(`User not exist`);
      console.error(`🚀 ~ io.use ~ error:`, error);

      return next(error);
    }

    s.data.user = user.toObject();
    return next();
  });

  io.use((s, next) => {
    s.join(s.data.user._id.toString());
    // console.log(`🚀 ~ io.use ~ s.data.user:`, s.data.user);

    /**
     * Báo mọi người là người này đang online
     */
    s.broadcast.to(s.data.user._id.toString()).emit(chatSocketAction.S_USER_ONLINE_STATUS, s.data.user._id.toString(), true);

    next();
  });

  // const { userId } = socket.data;

  // userId && socket.join(userId);

  // socket.on(chatSocketAction.newMessage, async (messageData: IChat, room?: string) => {
  //   try {
  //     const { sender, receiver, message } = messageData;
  //     const newMessage = new Chat({
  //       sender,
  //       receiver,
  //       message,
  //     });
  //     //   await newMessage.save();

  //     if (room) {
  //       socket.to(room).emit(chatSocketAction.newMessage, newMessage);
  //     } else {
  //       io.emit(chatSocketAction.newMessage, newMessage);
  //       // socket.broadcast.emit(chatSocketAction.newMessage, newMessage);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  socket.on(chatSocketAction.C_JOIN_ROOM, function (room: string) {
    try {
      console.log(`${socket.data.user.username} join room ${room}`);

      socket.join(room);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on(chatSocketAction.C_LEAVE_ROOM, function (room: string) {
    try {
      socket.leave(room);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(chatSocketAction.C_DELETE_ROOM, async function (msg: IChatMessagePayload) {
    console.log(`🚀 chatSocketAction.C_DELETE_ROOM ~ msg:`, msg);

    /**
     * Socket lúc này là SENDER
     */
    try {
      msg.members?.forEach(({ user }) => socket.to(user as unknown as string).emit(chatSocketAction.S_DELETE_ROOM, msg));
    } catch (error) {
      console.error(error);
    }
  });
  socket.on(chatSocketAction.C_SEEN_MSG, async function (msg: IChatMessage, receivers: string[]) {
    /**
     * Socket lúc này là SENDER
     */
    try {
      const seen = await ChatSocketService.createSeen(socket.data.user._id, msg);
      receivers.forEach((userId) => {
        if (userId === String(socket.data.user._id)) return;

        socket.to(userId).emit(chatSocketAction.S_SEEN_MSG, seen);
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on(chatSocketAction.C_SEND_MSG, async function (msg: IChatMessagePayload) {
    /**
     * Socket lúc này là SENDER
     */
    try {
      console.log(socket.data);

      let message: TChatList = undefined as never;

      if (msg?.room && msg.members?.length) {
        // send to a room
        console.log(`to room ${msg.room}`);

        const m = await ChatSocketService.createMessage(msg.sender, msg.room, msg.message);
        const seen = await ChatSocketService.createSeen(socket.data.user._id, m);
        const m_: IChatMessageWithSeen = {
          ...m,
          seen: [seen],
        };

        message = {
          room: msg.room,
          members: msg.members,
          messages: [m_],
        };

        // socket.to(msg.room).emit(chatSocketAction.S_SEND_MSG, message);
        // socket.emit(chatSocketAction.S_SEND_MSG, message);
      } else if (msg?.receiver) {
        /**
         * Tin nhắn gửi trực tiếp đến 1 nhóm người nào đó hoặc 1 người nào đó
         * Nghĩa là người này và người kia chưa có room chat
         * Ta sẽ tạo phòng
         */
        console.log(`new room`);

        // make a new room
        const { room, members } = await ChatSocketService.createRoom([socket.data.user._id, ...msg.receiver]);

        const m = await ChatSocketService.createMessage(msg.sender, room._id, msg.message);
        const seen = await ChatSocketService.createSeen(socket.data.user._id, m);
        const m_: IChatMessageWithSeen = {
          ...m,
          seen: [seen],
        };

        message = {
          room: room._id.toString(),
          members: members,
          messages: [m_],
        };

        // message = ChatSocketService.makeChatListObj(msg.room, msg.receiver, m.message);

        // socket.to(msg.receiver).emit(chatSocketAction.S_SEND_MSG, message);
        // socket.emit(chatSocketAction.S_SEND_MSG, message);
      }
      console.log(`🚀 ~ msg.receiver:`, msg.receiver);
      msg.receiver.forEach((receiver) => socket.to(receiver).emit(chatSocketAction.S_SEND_MSG, message));
      socket.emit(chatSocketAction.S_SEND_MSG, message);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected chat: ${socket.data.user ? socket.data.user._id : `Guest`}`);

    if (socket.data.user) {
      socket.broadcast.to(socket.data.user._id.toString()).emit(chatSocketAction.S_USER_ONLINE_STATUS, socket.data.user._id.toString(), false);
    }
  });
}
