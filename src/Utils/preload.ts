import { createRoomServicesOnStart } from "@/models/Room/RoomService";
import { createRoomTypeOnStart } from "@/models/Room/RoomType";
import { createGenderOnStart } from "@/models/User/Gender";
import { autoCreateRolesOnStart } from "@/models/User/Role";
import { createAdminOnStart } from "@/models/User/User";
import mongoose from "mongoose";

export default function preload() {
  return new Promise<void>((rs) => {
    if (mongoose.connection.readyState === 1) {
      doPreload().then(rs);
      return;
    }

    mongoose.connection.once("open", () => {
      doPreload().then(rs);
    });
  });
}

export async function doPreload() {
  await createGenderOnStart();
  await autoCreateRolesOnStart();

  await createAdminOnStart();

  await createRoomTypeOnStart();
  await createRoomServicesOnStart();
}
