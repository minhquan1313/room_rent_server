import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChat {
  _id: Types.ObjectId;

  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;

  updatedAt: Date;
  createdAt: Date;
}
interface IChatMethods {
  //  methods
}

interface ChatModel extends Model<IChat, {}, IChatMethods> {
  // static methods
}
export type ChatDocument = MongooseDocConvert<IChat, IChatMethods>;

const schema = new Schema<IChat, ChatModel, IChatMethods>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChat, ChatModel>("Chat", schema);

export { Chat };
