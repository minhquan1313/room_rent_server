import { Notification } from "@/models/Noti/Notification";
import PushNotificationService, { NotificationPayload } from "@/services/PushNotificationService";

export type TSubscription = {
  user: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

class NotificationService {
  async newSubscribe(subscription: TSubscription) {
    const sub = await Notification.create(subscription);
    return sub;
  }
  async deleteSubscribe(endpoint: string) {
    const doc = await Notification.findOne({
      endpoint,
    });

    await doc?.deleteOne();
  }

  async getSubscribeKeys(userId: string) {
    const key = await Notification.find({
      user: userId,
    }).lean();
    return key;
  }

  async sendMessageNotification({ nameOfUser, toUserId, message, chatRoomId }: { nameOfUser: string; toUserId: string; message: string; chatRoomId: string }) {
    console.log(`🚀 ~ NotificationService ~ sendMessageNotification ~ message:`, message);

    console.log(`🚀 ~ NotificationService ~ sendMessageNotification ~ toUserId:`, toUserId);

    console.log(`🚀 ~ NotificationService ~ sendMessageNotification ~ nameOfUser:`, nameOfUser);

    //

    const receiverKeys = await this.getSubscribeKeys(toUserId);
    console.log(`🚀 ~ NotificationService ~ sendMessageNotification ~ receiverKey:`, receiverKeys);

    if (!receiverKeys || !receiverKeys.length) return;

    try {
      const msg: NotificationPayload = {
        title: nameOfUser,
        body: message,
        link: `/chat/${chatRoomId}`,
        // link: `${frontEnd}/chat/${chatRoomId}`,
      };

      for await (const receiverKey of receiverKeys) {
        await PushNotificationService.triggerPushMsg(receiverKey, msg);
      }
    } catch (error) {}
  }
}

export default new NotificationService();
