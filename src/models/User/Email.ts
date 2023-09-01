import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { Model, Schema, Types, model } from "mongoose";

export interface IEmail {
  _id: Types.ObjectId;

  user: Types.ObjectId;
  email: string;
  verified: boolean;

  updatedAt: Date;
  createdAt: Date;
}
interface IEmailMethods {
  //
}

interface EmailModel extends Model<IEmail, {}, IEmailMethods> {
  // static methods
}
export type EmailDocument = MongooseDocConvert<IEmail, IEmailMethods>;

const schema = new Schema<IEmail, EmailModel, IEmailMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Email = model<IEmail, EmailModel>("Email", schema);

export { Email };
