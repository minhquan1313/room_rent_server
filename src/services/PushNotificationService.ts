import NotificationService from "@/services/NotificationService";
import webpush from "web-push";

// export type TNotificationAction = "openLink";

class PushNotificationService {
  init() {
    const vapidKeys = {
      publicKey: process.env.PUBLIC_PUSH_NOTI_KEY,
      privateKey: process.env.PRIVATE_PUSH_NOTI_KEY,
    };

    if (!vapidKeys.publicKey) throw new Error(`Missing vapidKeys.publicKey`);
    if (!vapidKeys.privateKey) throw new Error(`Missing vapidKeys.privateKey`);

    webpush.setVapidDetails("mailto:2051012011binh@ou.edu.vn", vapidKeys.publicKey, vapidKeys.privateKey);
  }

  async triggerPushMsg(subscription: webpush.PushSubscription, dataToSend: string) {
    try {
      return await webpush.sendNotification(subscription, dataToSend);
    } catch (err: any) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log("Subscription has expired or is no longer valid: ", err);

        await NotificationService.deleteSubscribe(subscription.endpoint);
      } else {
        console.log(`🚀 ~ triggerPushMsg ~ err:`, err);
        // throw err;
      }
    }
  }
}

export default new PushNotificationService();
