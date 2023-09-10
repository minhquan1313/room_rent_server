import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { Model, Schema, Types, model } from "mongoose";

export interface IRoomImage {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  image: string;
  order: number | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomImageMethods {
  //  methods
}

interface RoomImageModel extends Model<IRoomImage, {}, IRoomImageMethods> {
  // static methods
}
export type RoomImageDocument = MongooseDocConvert<IRoomImage, IRoomImageMethods>;

const schema = new Schema<IRoomImage, RoomImageModel, IRoomImageMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RoomImage = model<IRoomImage, RoomImageModel>("RoomImage", schema);

export { RoomImage };
