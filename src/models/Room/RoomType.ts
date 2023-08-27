import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomType = mongoose.model("RoomType", schema);

async function createRoomTypeOnStart() {
  const roomType = await RoomType.findOne();

  if (roomType) return;

  await RoomType.insertMany([
    {
      type: "Nhà trọ",
    },
    {
      type: "Nhà riêng",
    },
    {
      type: "Căn hộ chung cư",
    },
  ]);
}

export { RoomType, createRoomTypeOnStart };
