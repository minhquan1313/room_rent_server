import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface ILoginToken {
  _id: Types.ObjectId;

  user: Types.ObjectId;
  token: string;
  expire: Date;

  updatedAt: Date;
  createdAt: Date;
}
interface ILoginTokenMethods {
  //  methods
}

interface LoginTokenModel extends Model<ILoginToken, {}, ILoginTokenMethods> {
  // static methods
}
export type LoginTokenDocument = MongooseDocConvert<ILoginToken, ILoginTokenMethods>;

const schema = new Schema<ILoginToken, LoginTokenModel, ILoginTokenMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
schema.index({ user: 1, token: 1 }, { unique: true });

const LoginToken = mongoose.model<ILoginToken, LoginTokenModel>("LoginToken", schema);

export { LoginToken };
