import { chatSocketAction } from "@/constants/chatSocketActions";
import { IChatMessage } from "@/models/ChatSocket/ChatMessage";
import { IUser } from "@/models/User/User";
import ChatSocketService from "@/services/ChatSocketService";
import LoginTokenService from "@/services/LoginTokenService";
import NotificationService from "@/services/NotificationService";
import { IChatMessagePayload } from "@/types/IChatMessagePayload";
import { IChatMessageWithSeen, TChatList } from "@/types/TChatList";
import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface SocketData {
  user?: IUser;
}

export function chatSocket(this: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) {
  const io = this;
  console.log(`Chat socket connected - ${socket.data.user?.username ?? "Guest"}[${socket.data.user?._id || ""}]`);

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

    s.data.user = user;
    return next();
  });

  io.use((s, next) => {
    // console.log(`🚀 ~ Joining ${s.data.user._id.toString()}`);
    // console.log(s.data.user);

    if (s.data.user) {
      s.join(s.data.user._id.toString());
    } else {
      const error = new Error(`Missing s.data.user`);
      console.error(`🚀 ~ io.use ~ error:`, error);

      return next(error);
    }

    /**
     * Báo mọi người là người này đang online
     */
    // s.broadcast.to(s.data.user._id.toString()).emit(chatSocketAction.S_USER_ONLINE_STATUS, s.data.user._id.toString(), true);

    next();
  });

  socket.on(chatSocketAction.C_JOIN_ROOM, function (room: string) {
    try {
      if (!socket.data.user) return;

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

  // const usersSettingSeen: {
  //   [userId: string]: any;
  // } = {};

  socket.on(chatSocketAction.C_SEEN_MSG, async function (msg: IChatMessage, receivers: string[]) {
    if (!socket.data.user) return;
    console.log(`🚀 ~ chatSocketAction.C_SEEN_MSG receivers:`, receivers);

    console.log(`🚀 ~ chatSocketAction.C_SEEN_MSG msg:`, msg);

    /**
     * Socket lúc này là SENDER
     */
    // return;
    const uId = String(socket.data.user._id);
    // console.log(usersSettingSeen, new Date().getTime());

    try {
      // if (Object.hasOwn(usersSettingSeen, uId)) {
      //   /**
      //    * Trường hợp 1 user đăng nhập trên nhiều thiết bị, khi nhận được 1 tin nhắn và nhiều thiết bị đều focus
      //    * vào tin nhắn đó, thì sẽ có 1 loạt event seen từ 1 user sẽ được gửi vào đây, nên ta cần cấm trường hợp này
      //    * để tránh tạo ra nhiều document không cần thiết
      //    */
      //   console.log(`Có user đang gửi seen`);

      //   return;
      // }

      // usersSettingSeen[uId] = 1;
      const seen = await ChatSocketService.createSeen(uId, msg);
      console.log(`🚀 ~ seen:`, seen);

      if (!seen) return;

      // receivers.forEach((userId) => {
      //   console.log(`🚀 ~ receivers.forEach ~ userId:`, userId, receivers);

      //   socket.to(userId).emit(chatSocketAction.S_SEEN_MSG, seen);
      // });

      /**
       * Receiver lúc này là gồm tất cả mọi người trong chat, và đương nhiên gồm thằng sender
       */
      socket.in(receivers).emit(chatSocketAction.S_SEEN_MSG, seen);
      socket.emit(chatSocketAction.S_SEEN_MSG, seen);
    } catch (error) {
      // console.error(error);
    }
  });

  socket.on(chatSocketAction.C_SEND_MSG, async function (msg: IChatMessagePayload) {
    if (!socket.data.user) return;
    /**
     * Socket lúc này là SENDER
     */
    const uId = String(socket.data.user._id);
    console.log(`🚀 ~ uId:`, uId);

    try {
      console.log(socket.data);

      let message: TChatList = undefined as never;

      if (msg?.room && msg.members?.length) {
        // send to a room
        console.log(`to room ${msg.room}`);

        const m = await ChatSocketService.createMessage(msg.sender, msg.room, msg.message);
        const seen = await ChatSocketService.createSeen(uId, m);
        const m_: IChatMessageWithSeen = {
          ...m.toObject(),
          seen: [seen],
        };

        message = {
          room: msg.room,
          members: msg.members,
          messages: [m_],
        };
      } else if (msg?.receiver) {
        /**
         * Tin nhắn gửi trực tiếp đến 1 nhóm người nào đó hoặc 1 người nào đó
         * Nghĩa là người này và người kia chưa có room chat
         * Ta sẽ tạo phòng
         */
        console.log(`new room`);

        const { room, members } = await ChatSocketService.createRoom([uId, ...msg.receiver]);

        const m = await ChatSocketService.createMessage(msg.sender, room._id, msg.message);
        const seen = await ChatSocketService.createSeen(uId, m);
        const m_: IChatMessageWithSeen = {
          ...m.toObject(),
          seen: [seen],
        };

        message = {
          room: room._id.toString(),
          members: members,
          messages: [m_],
        };
      }

      io.adapter.rooms;
      console.log(`🚀 ~ io.adapter.rooms:`, io.adapter.rooms);

      console.log(`🚀 ~ msg.receiver:`, msg.receiver);
      /**
       * Mặc dù đã gắn uId vào rồi, nhưng socket chỉ bắn tới thằng client của máy thứ 2
       * nghĩa là cùng 1 account, đăng nhập 2 máy, nghĩa là vào cùng 1 room
       * với id của account, nhưng chỉ bắn vào thằng account mà không gửi tin nhắn
       *
       * msg.receiver ở đây bao gồm các thành viên trong đoạn chat trừ thằng gửi
       */
      socket.in(msg.receiver).in(uId).emit(chatSocketAction.S_SEND_MSG, message);
      socket.emit(chatSocketAction.S_SEND_MSG, message);
      console.log(`🚀 ~ message:`, message);

      /**
       * Bắn thông báo đẩy cho các client đang offline
       */

      const offlineClients = msg.receiver.filter((id) => !io.adapter.rooms.has(id));
      console.log(`🚀 ~ offlineClients:`, offlineClients);

      offlineClients.forEach((id) => {
        console.log(`🚀 ~ offlineClients.forEach ~ id:`, id);

        if (!socket.data.user) return;
        // const user = await UserService.getSingle(id);
        // if (!user) return;

        NotificationService.sendMessageNotification({
          nameOfUser: socket.data.user.first_name,
          toUserId: id,
          message: msg.message,
          chatRoomId: String(message.room),
        });
      });
      // if (msg.receiver.every((id) => io.adapter.rooms.has(id))) {
      //   msg.receiver.forEach((id) => {
      //     NotificationService.sendMessageNotification();
      //   });
      // }
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
