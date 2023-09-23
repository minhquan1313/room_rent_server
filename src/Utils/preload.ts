import { createRoomServicesOnStart } from "@/models/Room/RoomService";
import { createRoomServiceCategoryOnStart } from "@/models/Room/RoomServiceCategory";
import { createRoomTypeOnStart } from "@/models/Room/RoomType";
import { createGenderOnStart } from "@/models/User/Gender";
import { autoCreateRolesOnStart } from "@/models/User/Role";
import { createAdminOnStart } from "@/models/User/User";
import console from "console";
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
  createRoomTypeOnStart();

  await createGenderOnStart();
  await autoCreateRolesOnStart();

  await createAdminOnStart();

  await createRoomServiceCategoryOnStart();
  await createRoomServicesOnStart();

  // PushNotificationService.triggerPushMsg(
  //   {
  //     endpoint:
  //       "https://fcm.googleapis.com/fcm/send/dR33Ny_hDHg:APA91bEphSUr8z77Xf8OWKhFwckNPx-GPtA1G8Yx__58OMHWJ4f6U3tMEo4i92uDK-USHuXiGKtei_moFrQr4V6rcLEmik70IzlirpP74PbO4ucKuX7lNKe3WoBdt1hFCKD1JIvMqax7",
  //     keys: {
  //       p256dh: "BHRWYEJ1IWOqzFTMr0wi8brWUeRiQZdhiRETTK6wZdK5DRKTmYqGGIi1QT1V3KsT6_LooZ4PWRxisPR1CaCPY_w",
  //       auth: "7FyM3VZBWNGuf3SBtym4tw",
  //     },
  //   },
  //   {
  //     title: "Title nè",
  //     body: "Body nè hihi",
  //     action: "openLink",
  //   }
  // );

  // await ChatSeen.create({
  //   room: "650d045985feedfc9f6e6cd2",
  //   message_id: "650d065785feedfc9f6e6e99",
  //   seen_by: "65072fe688f86cb92b8ee560",
  // });

  // const l = await ChatSocketService.searchMessageOfRoom({
  //   room: "650d045985feedfc9f6e6cd2",
  //   from_date_to_previous: new Date().toISOString(),
  //   limit: "5",
  // });
  // const l = await ChatSocketService.searchRoomHasOnlyMembers(["65072fc9eda6171901329a2a", "65072fe688f86cb92b8ee560"]);
  // const l = await ChatSocketService.searchChatRoomBubbleList({ user: "65072fc9eda6171901329a2a" });

  // console.log(JSON.parse(JSON.stringify(l)));

  console.log(`Preload DONE`);
}
