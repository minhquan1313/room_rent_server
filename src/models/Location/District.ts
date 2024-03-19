import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IDistrict {
  _id: Types.ObjectId;

  code: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  province_code: string;

  updatedAt: Date;
  createdAt: Date;
}
interface IDistrictMethods {
  //  methods
}

interface DistrictModel extends Model<IDistrict, {}, IDistrictMethods> {
  // static methods
}
export type DistrictDocument = MongooseDocConvert<IDistrict, IDistrictMethods>;

const schema = new Schema<IDistrict, DistrictModel, IDistrictMethods>(
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
    province_code: {
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
const District = mongoose.model<IDistrict, DistrictModel>("LocDistrict", schema);

// async function preloadDistrict() {
//   if (await District.findOne()) return;

//   const dataToInsert: Omit<IDistrict, "_id" | "updatedAt" | "createdAt">[] = data.map((v) => {
//     let i = 0;
//     return {
//       code: v[i++],
//       name: v[i++],
//       name_en: v[i++],
//       full_name: v[i++],
//       full_name_en: v[i++],
//       code_name: v[i++],
//       province_code: v[i++],
//     };
//   });

//   await District.insertMany(dataToInsert);
// }

export { District };
