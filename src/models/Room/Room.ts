import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRoom {
  owner: Types.ObjectId;
  room_type: Types.ObjectId;
  name: string;
  sub_name: string | null;
  description: string | null;
  price_per_month: number;
  usable_area: number | null;
  number_of_room: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  number_of_floor: number;
  updatedAt: Date;
  createdAt: Date;
}
export type TRoomDocument = Document<unknown, {}, IRoom> &
  IRoom & {
    _id: Types.ObjectId;
  };

const schema = new Schema<IRoom>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    room_type: {
      type: Schema.Types.ObjectId,
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
schema.pre("find", function (next) {
  this.sort({
    createdAt: -1,
  });

  next();
});

const Room = mongoose.model("Room", schema);

export { Room };
