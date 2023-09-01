import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomType = "Nhà trọ" | "Nhà riêng" | "Căn hộ chung cư";
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

  interface ITemp extends Omit<IRoomType, "_id" | "updatedAt" | "createdAt"> {
    display_name: TRoomType;
  }
  const objs: ITemp[] = [
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

  await RoomType.insertMany(objs);
}

export { RoomType, createRoomTypeOnStart };
