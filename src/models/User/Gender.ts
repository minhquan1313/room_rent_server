import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TGender = "male" | "female" | "unknown";
export interface IGender {
  _id: Types.ObjectId;

  title: TGender;
  display_name: string | null;
}
interface IGenderMethods {}

interface UserModel extends Model<IGender, {}, IGenderMethods> {
  // static methods
}

export type GenderDocument = MongooseDocConvert<IGender, IGenderMethods>;

const schema = new Schema<IGender, UserModel, IGenderMethods>({
  title: {
    type: String,
    required: true,
  },
  display_name: {
    type: String,
    default: null,
  },
});

const Gender = mongoose.model<IGender, UserModel>("Gender", schema);
async function createGenderOnStart() {
  if (await Gender.findOne()) return;

  const obj: (Partial<IGender> & {
    title: TGender;
  })[] = [
    {
      title: "male",
      display_name: "Nam",
    },
    {
      title: "female",
      display_name: "Nữ",
    },
    {
      title: "unknown",
      display_name: "Không biết",
    },
  ];

  await Gender.insertMany(obj);
}
export { Gender, createGenderOnStart };
