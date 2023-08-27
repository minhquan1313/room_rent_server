import mongoose, { Schema } from "mongoose";

const schema = new Schema(
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

const RoomWithRoomService = mongoose.model("RoomWithRoomService", schema);

export { RoomWithRoomService };
