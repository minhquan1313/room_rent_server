import mongoose, { Model, Schema, Types } from "mongoose";

export interface IPhoneNumber {
  _id: Types.ObjectId;

  user: Types.ObjectId;
  region_code: string;
  country_code: number;
  national_number: number;
  e164_format: string;
  verified: boolean;

  updatedAt: Date;
  createdAt: Date;
}
interface IPhoneNumberMethods {
  //  methods
}

interface PhoneNumberModel extends Model<IPhoneNumber, {}, IPhoneNumberMethods> {
  // static methods
}
const schema = new Schema<IPhoneNumber, PhoneNumberModel, IPhoneNumberMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    region_code: {
      type: String,
      required: true,
    },
    country_code: {
      type: Number,
      required: true,
    },
    national_number: {
      type: Number,
      unique: true,
      required: true,
    },
    e164_format: {
      type: String,
      unique: true,
      required: true,
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
const PhoneNumber = mongoose.model<IPhoneNumber, PhoneNumberModel>("PhoneNumber", schema);

export { PhoneNumber };
