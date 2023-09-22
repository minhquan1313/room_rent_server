import { ChatMember, IChatMember } from "@/models/ChatSocket/ChatMember";
import { ChatMessage, IChatMessage } from "@/models/ChatSocket/ChatMessage";
import { ChatRoom } from "@/models/ChatSocket/ChatRoom";
import { ChatSeen } from "@/models/ChatSocket/ChatSeen";
import { IChatMessageWithSeen, TChatList } from "@/types/TChatList";
import { Types } from "mongoose";

export type TChatInRoomSearchPayload = {
  room: string;
  limit?: string;
  from_date_to_previous: string;
};

class ChatSocketService {
  async createRoom(members: (string | Types.ObjectId)[]) {
    const room = await ChatRoom.create({});

    let m: IChatMember[] = [];
    for await (const u of members) {
      m.push(
        await ChatMember.create({
          room,
          user: u,
        })
      );
    }

    return {
      room,
      members: m,
    };
  }
  async createMessage(sender: string | Types.ObjectId, room: string | Types.ObjectId, msg: string) {
    const message = await ChatMessage.create({
      room,
      message: msg,
      sender,
    });

    return message;
  }
  async createSeen(by: string | Types.ObjectId, msg: IChatMessage) {
    const seen = await ChatSeen.create({
      room: msg.room,
      seen_by: by,
    });

    return seen;
  }
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  async searchMessageOfRoom({ room, from_date_to_previous, limit }: TChatInRoomSearchPayload): Promise<IChatMessageWithSeen[]> {
    console.log(`🚀 ~ ChatSocketService ~ searchMessageOfRoom ~ limit:`, limit);

    console.log(`🚀 ~ ChatSocketService ~ searchMessageOfRoom ~ from_date_to_previous:`, from_date_to_previous);

    console.log(`🚀 ~ ChatSocketService ~ searchMessageOfRoom ~ room:`, room);

    // const doc = ChatMessage.find({
    //   room,
    //   createdAt: {
    //     $lt: from_date_to_previous,
    //   },
    // })
    //   .sort({
    //     createdAt: -1,
    //   })
    //   .limit(Number(limit) || 999);
    const doc = ChatMessage.aggregate([
      {
        $match: {
          room: new Types.ObjectId(room),
          createdAt: {
            $lt: new Date(from_date_to_previous),
          },
        },
      },
      {
        $lookup: {
          from: "chatseens",
          localField: "_id",
          foreignField: "message_id",
          as: "seen",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: Number(limit) || 999,
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
    const messages = await doc.exec();

    // messages.reverse();

    return messages;
  }

  async searchChatRoomBubbleList({ user, limit }: { user: string; limit?: string }): Promise<TChatList[]> {
    const chatList = ChatRoom.aggregate([
      {
        $lookup: {
          from: "chatmembers",
          localField: "_id",
          foreignField: "room",
          as: "members",
        },
      },
      {
        $match: {
          "members.user": { $in: [new Types.ObjectId(user)] },
        },
      },
      {
        $lookup: {
          from: "chatmessages",
          localField: "_id",
          foreignField: "room",
          as: "messages",
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $limit: Number(limit) || 99,
      },
      {
        $project: {
          _id: 0,
          room: "$_id",
          messages: { $slice: ["$messages", -1] }, // lấy obj tin nhắn cuối cùng trong mảng : messages : [{...}]
          // messages: { $last: "$messages" }, // lấy obj tin nhắn cuối cùng trong mảng : messages : {...}
          // messages: "$messages.message", // chỉ lấy nội dung tin nhắn
          // messages: {
          //   message: 1,
          // },
          members: 1,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $lookup: {
          from: "chatseens",
          localField: "messages._id",
          foreignField: "message_id",
          as: "messages.seen",
        },
      },
      {
        $group: {
          _id: "$room",
          members: { $first: "$members" },
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    const doc = await chatList.exec();

    return doc;
  }

  // makeChatListObj({ room, messages, members }: { room: string; members: IChatMember[]; messages: IChatMessage[] }): TChatList {
  //   const o: TChatList = {
  //     room,
  //     members,
  //     messages,
  //   };

  //   return o;
  // }

  async searchRoomHasOnlyMembers(members: string[]): Promise<TChatList[]> {
    const r: TChatList[] = await ChatRoom.aggregate([
      {
        $lookup: {
          from: `chatmembers`,
          localField: `_id`,
          foreignField: `room`,
          as: `members`,
        },
      },
      {
        $match: {
          "members.user": {
            $all: members.map((id) => new Types.ObjectId(id)),
          },
          members: {
            $size: members.length,
          },
        },
      },
      {
        $lookup: {
          from: "chatmessages",
          localField: "_id",
          foreignField: "room",
          as: "messages",
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $project: {
          _id: 0,
          room: "$_id",
          messages: { $slice: ["$messages", -1] },
          members: 1,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $lookup: {
          from: "chatseens",
          localField: "messages._id",
          foreignField: "message_id",
          as: "messages.seen",
        },
      },
      {
        $group: {
          _id: "$room",
          members: { $first: "$members" },
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    return r;
  }
}

export default new ChatSocketService();
