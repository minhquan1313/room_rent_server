import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      unique: true,
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

const LoginToken = mongoose.model("LoginToken", schema);

export { LoginToken };
