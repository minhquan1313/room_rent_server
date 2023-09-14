import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomService =
  | "wifi"
  | "mt"
  | "tttp"
  | "nth"
  | "anc"
  | "hgx"
  | "og"
  | "gl"
  | "bnl"
  | "kb"
  | "mg"
  | "dh"
  | "tl"
  | "gn"
  | "taq"
  | "bct"
  | "bdxr"
  | "can"
  | "hb"
  | "sv"
  | "c"
  | "st"
  | "bv"
  | "th"
  | "cv"
  | "bxb"
  | "tttdtt";
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
      display_name: "Wifi",
    },
    {
      title: "mt",
      display_name: "Mặt tiền",
    },
    {
      title: "tttp",
      display_name: "Trung tâm thành phố",
    },
    {
      title: "nth",
      display_name: "Nhà trong hẻm",
    },
    {
      title: "anc",
      display_name: "An ninh cao",
    },
    {
      title: "hgx",
      display_name: "Hầm gửi xe",
    },
    {
      title: "og",
      display_name: "Ở ghép",
    },
    {
      title: "gl",
      display_name: "Gác lửng",
    },
    {
      title: "bnl",
      display_name: "Bình nóng lạnh",
    },
    {
      title: "kb",
      display_name: "Kệ bếp",
    },
    {
      title: "mg",
      display_name: "Máy giặt",
    },
    {
      title: "dh",
      display_name: "Điều hòa",
    },
    {
      title: "tl",
      display_name: "Tủ lạnh",
    },
    {
      title: "gn",
      display_name: "Giường nệm",
    },
    {
      title: "taq",
      display_name: "Tủ áo quần",
    },
    {
      title: "bct",
      display_name: "Ban công/sân thượng",
    },
    {
      title: "bdxr",
      display_name: "Bãi để xe riêng",
    },
    {
      title: "can",
      display_name: "Camera an ninh",
    },
    {
      title: "hb",
      display_name: "Hồ bơi",
    },
    {
      title: "sv",
      display_name: "Sân vườn",
    },
    {
      title: "c",
      display_name: "Chợ",
    },
    {
      title: "st",
      display_name: "Siêu thị",
    },
    {
      title: "bv",
      display_name: "Bệnh viện",
    },
    {
      title: "th",
      display_name: "Trường học",
    },
    {
      title: "cv",
      display_name: "Công viên",
    },
    {
      title: "bxb",
      display_name: "Bến xe Bus",
    },
    {
      title: "tttdtt",
      display_name: "Trung tâm thể dục thể thao",
    },
  ];

  await RoomService.insertMany(obj);
}

export { RoomService, createRoomServicesOnStart };
