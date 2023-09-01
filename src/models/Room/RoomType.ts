import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomType = "cc" | "nr" | "nt";
export interface IRoomType {
  _id: Types.ObjectId;
  title: string;
  display_name: string | null;
  updatedAt: Date;
  createdAt: Date;
}
interface IRoomTypeMethods {
  //  methods
}

interface RoomTypeModel extends Model<IRoomType, {}, IRoomTypeMethods> {
  // static methods
}
export type RoomTypeDocument = MongooseDocConvert<IRoomType, IRoomTypeMethods>;

const schema = new Schema<IRoomType, RoomTypeModel, IRoomTypeMethods>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    display_name: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RoomType = mongoose.model<IRoomType, RoomTypeModel>("RoomType", schema);

async function createRoomTypeOnStart() {
  if (await RoomType.findOne()) return;

  const obj: (Partial<IRoomType> & {
    title: TRoomType;
  })[] = [
    {
      title: "cc",
      display_name: "Căn hộ chung cư",
    },
    {
      title: "nr",
      display_name: "Nhà riêng",
    },
    {
      title: "nt",
      display_name: "Nhà trọ",
    },
  ];

  await RoomType.insertMany(obj);
}

export { RoomType, createRoomTypeOnStart };
