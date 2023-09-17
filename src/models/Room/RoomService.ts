import { RoomServiceCategory } from "@/models/Room/RoomServiceCategory";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { FilterQuery, Model, Query, Schema, Types, model } from "mongoose";

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
  display_name: string;
  category: Types.ObjectId | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomServiceMethods {
  //  methods
  populateAll(): Promise<RoomServiceDocument>;
}

interface RoomServiceModel extends Model<IRoomService, {}, IRoomServiceMethods> {
  // static methods
  findPopulated(query?: FilterQuery<IRoomService>): Query<RoomServiceDocument[], RoomServiceDocument, unknown, any, "find">;
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
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "RoomServiceCategory",
    },
  },
  {
    timestamps: true,
    methods: {
      async populateAll(this: RoomServiceDocument) {
        return await this.populate([
          {
            path: "category",
          },
        ]);
      },
    },
    statics: {
      findPopulated(query) {
        return model("RoomService")
          .find(query)
          .populate([
            {
              path: "category",
            },
          ]);
      },
    },
  }
);

const RoomService = model<IRoomService, RoomServiceModel>("RoomService", schema);

async function createRoomServicesOnStart() {
  if (await RoomService.findOne()) return;

  const tnCate = await RoomServiceCategory.findOne({
    title: "tn",
  });
  const mtCate = await RoomServiceCategory.findOne({
    title: "mt",
  });

  const obj: (Partial<IRoomService> & {
    title: TRoomService;
  })[] = [
    {
      title: "wifi",
      display_name: "Wifi",
      category: tnCate?._id,
    },
    {
      title: "mt",
      display_name: "Mặt tiền",
      category: tnCate?._id,
    },
    {
      title: "tttp",
      display_name: "Trung tâm thành phố",
      category: tnCate?._id,
    },
    {
      title: "nth",
      display_name: "Nhà trong hẻm",
      // category: tnCate?._id,
    },
    {
      title: "anc",
      display_name: "An ninh cao",
      category: tnCate?._id,
    },
    {
      title: "hgx",
      display_name: "Hầm gửi xe",
      category: tnCate?._id,
    },
    {
      title: "og",
      display_name: "Ở ghép",
      category: tnCate?._id,
    },
    {
      title: "gl",
      display_name: "Gác lửng",
      category: tnCate?._id,
    },
    {
      title: "bnl",
      display_name: "Bình nóng lạnh",
      category: tnCate?._id,
    },
    {
      title: "kb",
      display_name: "Kệ bếp",
      category: tnCate?._id,
    },
    {
      title: "mg",
      display_name: "Máy giặt",
      category: tnCate?._id,
    },
    {
      title: "dh",
      display_name: "Điều hòa",
      category: tnCate?._id,
    },
    {
      title: "tl",
      display_name: "Tủ lạnh",
      category: tnCate?._id,
    },
    {
      title: "gn",
      display_name: "Giường nệm",
      category: tnCate?._id,
    },
    {
      title: "taq",
      display_name: "Tủ áo quần",
      category: tnCate?._id,
    },
    {
      title: "bct",
      display_name: "Ban công/sân thượng",
      category: tnCate?._id,
    },
    {
      title: "bdxr",
      display_name: "Bãi để xe riêng",
      category: tnCate?._id,
    },
    {
      title: "can",
      display_name: "Camera an ninh",
      category: tnCate?._id,
    },
    {
      title: "hb",
      display_name: "Hồ bơi",
      category: tnCate?._id,
    },
    {
      title: "sv",
      display_name: "Sân vườn",
      category: tnCate?._id,
    },
    {
      title: "c",
      display_name: "Chợ",
      category: mtCate?._id,
    },
    {
      title: "st",
      display_name: "Siêu thị",
      category: mtCate?._id,
    },
    {
      title: "bv",
      display_name: "Bệnh viện",
      category: mtCate?._id,
    },
    {
      title: "th",
      display_name: "Trường học",
      category: mtCate?._id,
    },
    {
      title: "cv",
      display_name: "Công viên",
      category: mtCate?._id,
    },
    {
      title: "bxb",
      display_name: "Bến xe Bus",
      category: mtCate?._id,
    },
    {
      title: "tttdtt",
      display_name: "Trung tâm thể dục thể thao",
      category: mtCate?._id,
    },
  ];

  await RoomService.insertMany(obj);
}

export { RoomService, createRoomServicesOnStart };
