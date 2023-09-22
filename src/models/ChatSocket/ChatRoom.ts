import { ChatMember } from "@/models/ChatSocket/ChatMember";
import { ChatMessage } from "@/models/ChatSocket/ChatMessage";
import { ChatSeen } from "@/models/ChatSocket/ChatSeen";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChatRoom {
  _id: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface IChatRoomMethods {
  //  methods
}

interface ChatRoomModel extends Model<IChatRoom, {}, IChatRoomMethods> {
  // static methods
}
export type ChatRoomDocument = MongooseDocConvert<IChatRoom, IChatRoomMethods>;

const schema = new Schema<IChatRoom, ChatRoomModel, IChatRoomMethods>(
  {},
  {
    timestamps: true,
  }
);
schema.pre("deleteOne", { document: true }, async function (this: ChatRoomDocument, next) {
  // Remove all the assignment docs that reference the removed person.
  this._id;
  console.log(`🚀 ~ this._id:`, this._id);

  await ChatMember.deleteMany({
    room: this._id,
  });

  await ChatMessage.deleteMany({
    room: this._id,
  });

  await ChatSeen.deleteMany({
    room: this._id,
  });

  next();
  // this.model('Assignment').remove({ person: this._id }, next);
});

const ChatRoom = mongoose.model<IChatRoom, ChatRoomModel>("ChatRoom", schema);

export { ChatRoom };
