import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChatMember {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  user: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface IChatMemberMethods {
  //  methods
}

interface ChatMemberModel extends Model<IChatMember, {}, IChatMemberMethods> {
  // static methods
}
export type ChatMemberDocument = MongooseDocConvert<IChatMember, IChatMemberMethods>;

const schema = new Schema<IChatMember, ChatMemberModel, IChatMemberMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
schema.index({ room: 1, user: 1 }, { unique: true });

const ChatMember = mongoose.model<IChatMember, ChatMemberModel>("ChatMember", schema);

export { ChatMember };
