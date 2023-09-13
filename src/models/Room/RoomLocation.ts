import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IRoomLocation {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  lat: number;
  long: number;
  country: string;
  province: string;
  district?: string;
  ward?: string;
  detail_location: string;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomTypeMethods {
  //  methods
}

interface RoomTypeModel extends Model<IRoomLocation, {}, IRoomTypeMethods> {
  // static methods
}
export type RoomLocationDocument = MongooseDocConvert<IRoomLocation, IRoomTypeMethods>;

const schema = new Schema<IRoomLocation, RoomTypeModel, IRoomTypeMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
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
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      default: null,
    },
    ward: {
      type: String,
      default: null,
    },
    detail_location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomLocation = mongoose.model<IRoomLocation, RoomTypeModel>("RoomLocation", schema);

export { RoomLocation };
