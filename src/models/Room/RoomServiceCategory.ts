import { RoomService } from "@/models/Room/RoomService";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRoomServiceCategory = "tn" | "mt";
export interface IRoomServiceCategory {
  _id: Types.ObjectId;

  title: TRoomServiceCategory;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomServiceCategoryMethods {
  //  methods
}

interface RoomServiceCategoryModel extends Model<IRoomServiceCategory, {}, IRoomServiceCategoryMethods> {
  // static methods
}
export type RoomServiceCategoryDocument = MongooseDocConvert<IRoomServiceCategory, IRoomServiceCategoryMethods>;

const schema = new Schema<IRoomServiceCategory, RoomServiceCategoryModel, IRoomServiceCategoryMethods>(
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
schema.pre("deleteOne", { document: true }, async function (this: IRoomServiceCategory, next) {
  // Remove all the assignment docs that reference the removed person.
  const { _id } = this;

  await RoomService.deleteMany({
    category: _id,
  });

  next();
});

const RoomServiceCategory = mongoose.model<IRoomServiceCategory, RoomServiceCategoryModel>("RoomServiceCategory", schema);

async function createRoomServiceCategoryOnStart() {
  if (await RoomServiceCategory.findOne()) return;

  const obj: (Partial<IRoomServiceCategory> & {
    title: TRoomServiceCategory;
  })[] = [
    {
      title: "tn",
      display_name: "Tiện nghi",
    },
    {
      title: "mt",
      display_name: "Xung quanh",
    },
  ];

  await RoomServiceCategory.insertMany(obj);
}

export { RoomServiceCategory, createRoomServiceCategoryOnStart };
