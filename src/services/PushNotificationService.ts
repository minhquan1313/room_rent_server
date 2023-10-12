import NotificationService from "@/services/NotificationService";
import webpush from "web-push";

class PushNotificationService {
  constructor() {
    const { PUBLIC_PUSH_NOTI_KEY, PRIVATE_PUSH_NOTI_KEY } = process.env;

    if (!PUBLIC_PUSH_NOTI_KEY) throw new Error(`Missing PUBLIC_PUSH_NOTI_KEY`);
    if (!PRIVATE_PUSH_NOTI_KEY) throw new Error(`Missing PRIVATE_PUSH_NOTI_KEY`);

    webpush.setVapidDetails("mailto:2051012011binh@ou.edu.vn", PUBLIC_PUSH_NOTI_KEY, PRIVATE_PUSH_NOTI_KEY);
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
      }
    }
  }
}

export default new PushNotificationService();
