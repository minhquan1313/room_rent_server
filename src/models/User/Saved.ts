import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    room: {
      type: Types.ObjectId,
      required: true,
      ref: "Room",
    },
  },
  {
    timestamps: true,
  }
);

const Saved = mongoose.model("Saved", schema);

export { Saved };
