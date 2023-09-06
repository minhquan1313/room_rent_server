import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomService = "wifi" | "mt" | "center" | "hood" | "security" | "parking";
export interface IRoomService {
  _id: Types.ObjectId;

  title: string;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomServiceMethods {
  //  methods
}

interface RoomServiceModel extends Model<IRoomService, {}, IRoomServiceMethods> {
  // static methods
}
export type RoomServiceDocument = MongooseDocConvert<IRoomService, IRoomServiceMethods>;

const schema = new Schema<IRoomService, RoomServiceModel, IRoomServiceMethods>(
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

const RoomService = mongoose.model<IRoomService, RoomServiceModel>("RoomService", schema);

async function createRoomServicesOnStart() {
  if (await RoomService.findOne()) return;

  const obj: (Partial<IRoomService> & {
    title: TRoomService;
  })[] = [
    {
      title: "wifi",
      display_name: "Wifi free",
    },
    {
      title: "mt",
      display_name: "Mặt tiền",
    },
    {
      title: "center",
      display_name: "Trung tâm thành phố",
    },
    {
      title: "hood",
      display_name: "Nhà trong hẻm",
    },
    {
      title: "security",
      display_name: "An ninh cao",
    },
    {
      title: "parking",
      display_name: "Có hầm gửi xe",
    },
  ];

  await RoomService.insertMany(obj);
}

export { RoomService, createRoomServicesOnStart };
