import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: Types.ObjectId,
      required: true,
      ref: "Email",
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

const EmailVerifyToken = mongoose.model("EmailVerifyToken", schema);

export { EmailVerifyToken };
