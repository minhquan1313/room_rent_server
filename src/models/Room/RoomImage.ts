import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    room: {
      type: Types.ObjectId,
      required: true,
      ref: "Room",
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomImage = mongoose.model("RoomImage", schema);

export { RoomImage };
