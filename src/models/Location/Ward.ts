import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IWard {
  _id: Types.ObjectId;

  code: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  district_code: string;

  updatedAt: Date;
  createdAt: Date;
}
interface DocMethods {
  //  methods
}

interface DocModel extends Model<IWard, {}, DocMethods> {
  // static methods
}
export type WardDocument = MongooseDocConvert<IWard, DocMethods>;

const schema = new Schema<IWard, DocModel, DocMethods>(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    name_en: {
      type: String,
      trim: true,
    },
    full_name: {
      type: String,
      trim: true,
    },
    full_name_en: {
      type: String,
      trim: true,
    },
    code_name: {
      type: String,
      trim: true,
    },
    district_code: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
schema.index({
  full_name: "text",
});
const Ward = mongoose.model<IWard, DocModel>("LocWard", schema);

export { Ward };
