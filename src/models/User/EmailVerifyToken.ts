import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IEmailVerifyToken {
  _id: Types.ObjectId;

  email: Types.ObjectId;
  token: string;
  expire: Date;

  updatedAt: Date;
  createdAt: Date;
}
interface IEmailVerifyTokenMethods {}

interface UserModel extends Model<IEmailVerifyToken, {}, IEmailVerifyTokenMethods> {
  // static methods
}

export type EmailVerifyTokenDocument = MongooseDocConvert<IEmailVerifyToken, IEmailVerifyTokenMethods>;

const schema = new Schema<IEmailVerifyToken, UserModel, IEmailVerifyTokenMethods>(
  {
    email: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Email",
    },
    token: {
      type: String,
      required: true,
      unique: true,
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

const EmailVerifyToken = mongoose.model<IEmailVerifyToken, UserModel>("EmailVerifyToken", schema);

export { EmailVerifyToken };
