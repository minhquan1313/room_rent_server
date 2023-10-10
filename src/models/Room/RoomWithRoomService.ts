import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IRoomWithRoomService {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  service: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomWithRoomServiceMethods {
  //  methods
}

interface RoomWithRoomServiceModel extends Model<IRoomWithRoomService, {}, IRoomWithRoomServiceMethods> {
  // static methods
}
export type RoomWithRoomServiceDocument = MongooseDocConvert<IRoomWithRoomService, IRoomWithRoomServiceMethods>;

const schema = new Schema<IRoomWithRoomService, RoomWithRoomServiceModel, IRoomWithRoomServiceMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "RoomService",
    },
  },
  {
    timestamps: true,
  }
);

const RoomWithRoomService = mongoose.model<IRoomWithRoomService, RoomWithRoomServiceModel>("RoomWithRoomService", schema);

export { RoomWithRoomService };
