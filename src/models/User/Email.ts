import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    email: {
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

const Email = mongoose.model("Email", schema);

export { Email };
