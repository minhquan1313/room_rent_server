import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChatMessage {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;

  updatedAt: Date;
  createdAt: Date;
}
interface IChatMessageMethods {
  //  methods
}

interface ChatMessageModel extends Model<IChatMessage, {}, IChatMessageMethods> {
  // static methods
}
export type ChatMessageDocument = MongooseDocConvert<IChatMessage, IChatMessageMethods>;

const schema = new Schema<IChatMessage, ChatMessageModel, IChatMessageMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    // seen: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model<IChatMessage, ChatMessageModel>("ChatMessage", schema);

export { ChatMessage };
