import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Gender = mongoose.model("Gender", schema);
async function createGenderOnStart() {
  const gender = await Gender.findOne();

  if (gender) return;

  await Gender.insertMany([
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
  ]);
}
export { Gender, createGenderOnStart };
