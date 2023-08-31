import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
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
    },
    e164_format: {
      type: String,
      unique: true,
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
const PhoneNumber = mongoose.model("PhoneNumber", schema);

export { PhoneNumber };
