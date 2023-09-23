import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChatSeen {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  message_id: Types.ObjectId;
  seen_by: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface IChatSeenMethods {
  //  methods
}

interface ChatSeenModel extends Model<IChatSeen, {}, IChatSeenMethods> {
  // static methods
}
export type ChatSeenDocument = MongooseDocConvert<IChatSeen, IChatSeenMethods>;

const schema = new Schema<IChatSeen, ChatSeenModel, IChatSeenMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    message_id: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      required: true,
    },
    seen_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ message_id: 1, seen_by: 1 }, { unique: true });

const ChatSeen = mongoose.model<IChatSeen, ChatSeenModel>("ChatSeen", schema);

export { ChatSeen };
