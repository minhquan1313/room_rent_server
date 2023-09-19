import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IRoomLocation {
  _id: Types.ObjectId;

  room: Types.ObjectId;

  lat_long: {
    type: "Point";
    coordinates: [number, number];
  };

  // lat: number;
  // long: number;
  country: string;
  province: string;
  district?: string;
  ward?: string;
  detail_location?: string;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomLocationMethods {
  //  methods
}

interface RoomLocationModel extends Model<IRoomLocation, {}, IRoomLocationMethods> {
  // static methods
}
export type RoomLocationDocument = MongooseDocConvert<IRoomLocation, IRoomLocationMethods>;

const schema = new Schema<IRoomLocation, RoomLocationModel, IRoomLocationMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    lat_long: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number, Number],
        required: true,
      },
    },

    // lat: {
    //   type: Number,
    //   required: true,
    // },
    // long: {
    //   type: Number,
    //   required: true,
    // },
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
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ lat_long: "2dsphere" });

const RoomLocation = mongoose.model<IRoomLocation, RoomLocationModel>("RoomLocation", schema);

export { RoomLocation };
