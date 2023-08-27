import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    room_type: {
      type: Types.ObjectId,
      required: true,
      ref: "RoomType",
    },
    name: {
      type: String,
      required: true,
    },
    sub_name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    price_per_month: {
      type: Number,
      required: true,
    },
    usable_area: {
      // square meters
      type: Number,
      default: null,
    },
    number_of_room: {
      type: Number,
      default: null,
    },
    number_of_bedroom: {
      type: Number,
      default: null,
    },
    number_of_bathroom: {
      type: Number,
      default: null,
    },
    number_of_floor: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", schema);

export { Room };
