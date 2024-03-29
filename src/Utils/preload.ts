import { testData } from "@/config/testData/testData";
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
  console.log("Preload starting");
  // createRoomTypeOnStart();

  // await createGenderOnStart();
  // await autoCreateRolesOnStart();

  // await createAdminOnStart();

  // await createRoomServiceCategoryOnStart();
  // await createRoomServicesOnStart();

  await testData.add();

  // await StatsServices.countRoomFromTo(dateFormat("2023-9-1").toDate(), dateFormat("2023-10-5").toDate(), "month");

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

  // SmsService.send("+84559232356", "Test ne");
  // MailService.sendEmailVerifyCode({
  //   email: "minhquan1313@gmail.com",
  //   code: "123",
  // });

  // let t = JWTService.sign(
  //   { ten: "Binh" },
  //   {
  //     expiresIn: "1s",
  //   }
  // );
  // console.log(`🚀 ~ doPreload ~ t:`, t);

  // const { ten } = JWTService.verify(t);
  // console.log(`🚀 ~ doPreload ~ ten:`, ten);

  // setTimeout(() => {
  //   try {
  //     console.log(`🚀 ~ doPreload ~ ten:`, JWTService.verify(t + "1"));
  //   } catch (error) {
  //     console.log(`🚀 ~ setTimeout ~ error:`, error);

  //     // console.log(`🚀 ~ setTimeout ~ error:`, String(error).includes("jwt expired"));
  //   }
  // }, 2000);
  // const t = binarySearch(vnLocationData, ({ code }) => {
  //   return [code === 12, code > 12];
  // });
  // console.log(`🚀 ~ t ~ t:`, t);
  console.log(`Preload DONE`);
}
