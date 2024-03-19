import logger from "@/Utils/logger";
import { ChatMember } from "@/models/ChatSocket/ChatMember";
import { ChatMessage } from "@/models/ChatSocket/ChatMessage";
import { ChatRoom } from "@/models/ChatSocket/ChatRoom";
import { ChatSeen } from "@/models/ChatSocket/ChatSeen";
import { District } from "@/models/Location/District";
import { Province } from "@/models/Location/Province";
import { Ward } from "@/models/Location/Ward";
import { Notification } from "@/models/Noti/Notification";
import { Room } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { RoomLocation } from "@/models/Room/RoomLocation";
import { RoomService } from "@/models/Room/RoomService";
import { RoomServiceCategory } from "@/models/Room/RoomServiceCategory";
import { RoomType } from "@/models/Room/RoomType";
import { Email } from "@/models/User/Email";
import { Gender } from "@/models/User/Gender";
import { LoginToken } from "@/models/User/LoginToken";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role } from "@/models/User/Role";
import { Saved } from "@/models/User/Saved";
import { User } from "@/models/User/User";
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

async function doPreload() {
  logger("Preload starting");

  // createRoomTypeOnStart();

  // await createGenderOnStart();
  // await autoCreateRolesOnStart();
  // await createAdminOnStart();
  // await createRoomServiceCategoryOnStart();
  // await createRoomServicesOnStart();

  // await testData.add();

  // await preloadProvince();
  // await preloadDistrict();
  // await preloadWard();

  // await db.dump({
  //   sourceToMongoExportExe: "D:/Downloads/mongodb-database-tools-windows-x86_64-100.9.4/mongoexport.exe",
  // });

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

  await ChatMember.syncIndexes();
  await ChatMessage.syncIndexes();
  await ChatRoom.syncIndexes();
  await ChatSeen.syncIndexes();

  await District.syncIndexes();
  await Province.syncIndexes();
  await Ward.syncIndexes();

  await Notification.syncIndexes();

  await Room.syncIndexes();
  await RoomImage.syncIndexes();
  await RoomLocation.syncIndexes();
  await RoomService.syncIndexes();
  await RoomServiceCategory.syncIndexes();
  await RoomType.syncIndexes();

  await Email.syncIndexes();
  await Gender.syncIndexes();
  await LoginToken.syncIndexes();
  await PhoneNumber.syncIndexes();
  await Role.syncIndexes();
  await Saved.syncIndexes();
  await User.syncIndexes();

  console.log(`Preload DONE`);
}
