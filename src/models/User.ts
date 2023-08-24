import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    roleId: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);

export { User };
