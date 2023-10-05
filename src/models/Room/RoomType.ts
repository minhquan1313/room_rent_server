import { Room } from "@/models/Room/Room";
import RoomService from "@/services/RoomService";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomType = "cc" | "nr" | "nt" | "ktx" | "ccm" | "ttncc";
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
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);
schema.pre("deleteOne", { document: true }, async function (this: IRoomType, next) {
  // Remove all the assignment docs that reference the removed person.
  const { _id } = this;

  const rooms = await Room.find({ room_type: _id });
  await RoomService.deleteMany(rooms.map((r) => r._id));

  next();
});

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
    {
      title: "ktx",
      display_name: "Ký túc xá",
    },
    {
      title: "ccm",
      display_name: "Chung cư mini",
    },
    {
      title: "ttncc",
      display_name: "Trọ trong nhà chung chủ",
    },
  ];

  await RoomType.insertMany(obj);
}

export { RoomType, createRoomTypeOnStart };
