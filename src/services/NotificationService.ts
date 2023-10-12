import { Notification } from "@/models/Noti/Notification";
import PushNotificationService from "@/services/PushNotificationService";

export type TSubscription = {
  user: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
export type NotificationPayload = {
  title: string;
  body: string;
  link: string;
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
    const receiverKeys = await this.getSubscribeKeys(toUserId);
    if (!receiverKeys || !receiverKeys.length) return;

    try {
      const msg: NotificationPayload = {
        title: `Tin nhắn mới từ ` + nameOfUser,
        body: message,
        link: `/chat/${chatRoomId}`,
      };

      for await (const receiverKey of receiverKeys) {
        const result = await PushNotificationService.triggerPushMsg(receiverKey, JSON.stringify(msg));
        console.log(`🚀 ~ NotificationService ~ forawait ~ result:`, result);
      }
    } catch (error) {
      console.log(`🚀 ~ NotificationService ~ sendMessageNotification ~ error:`, error);
    }
  }
}

export default new NotificationService();
