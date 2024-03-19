import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { Model, Schema, Types, model } from "mongoose";

export interface IProvince {
  _id: Types.ObjectId;

  code: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  image: string | null;

  updatedAt: Date;
  createdAt: Date;
}
interface DocMethods {
  //  methods
}

interface DocModel extends Model<IProvince, {}, DocMethods> {
  // static methods
}
export type ProvinceDocument = MongooseDocConvert<IProvince, DocMethods>;

const schema = new Schema<IProvince, DocModel, DocMethods>(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    full_name_en: {
      type: String,
      required: true,
      trim: true,
    },
    code_name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
schema.index({
  full_name: "text",
});
const Province = model<IProvince, DocModel>("LocProvince", schema);

// async function preloadProvince() {
//   if (await Province.findOne()) return;

//   const dataToInsert: Omit<IProvince, "_id" | "updatedAt" | "createdAt">[] = data.map((v) => {
//     let i = 0;
//     return {
//       code: v[i++],
//       name: v[i++],
//       name_en: v[i++],
//       full_name: v[i++],
//       full_name_en: v[i++],
//       code_name: v[i++],
//       image: null,
//     };
//   });

//   await Province.insertMany(dataToInsert);
// }
export { Province };
