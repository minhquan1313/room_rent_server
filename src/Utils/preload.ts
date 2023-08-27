import { createRoomServicesOnStart } from "@/models/Room/RoomService";
import { createRoomTypeOnStart } from "@/models/Room/RoomType";
import { autoCreateRolesOnStart } from "@/models/User/Role";
import { createAdminOnStart } from "@/models/User/User";
import PhoneService from "@/services/PhoneService";
import mongoose from "mongoose";

export default function preload() {
  return new Promise<void>((rs) => {
    if (mongoose.connection.readyState === 1) {
      doCreate().then(rs);
    } else
      mongoose.connection.once("open", async () => {
        await doCreate();

        rs();
      });
  });
}

export async function doCreate() {
  await autoCreateRolesOnStart();
  await createAdminOnStart();

  await createRoomTypeOnStart();
  await createRoomServicesOnStart();
}
