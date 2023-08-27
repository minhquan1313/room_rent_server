import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    furniture: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RoomService = mongoose.model("RoomService", schema);

async function createRoomServicesOnStart() {
  const roomService = await RoomService.findOne();

  if (roomService) return;

  await RoomService.insertMany([
    {
      furniture: "Wifi free",
    },
    {
      furniture: "Mặt tiền",
    },
    {
      furniture: "Trung tâm thành phố",
    },
    {
      furniture: "Nhà trong hẻm",
    },
    {
      furniture: "An ninh cao",
    },
    {
      furniture: "Có hầm gửi xe",
    },
  ]);
}

export { RoomService, createRoomServicesOnStart };
