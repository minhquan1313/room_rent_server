import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    room: {
      type: Types.ObjectId,
      required: true,
      ref: "Room",
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    province_code: {
      type: Number,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    district_code: {
      type: Number,
      required: true,
    },
    ward: {
      type: String,
      default: null,
    },
    ward_code: {
      type: Number,
      default: null,
    },
    detail_location: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RoomLocation = mongoose.model("RoomLocation", schema);

export { RoomLocation };
