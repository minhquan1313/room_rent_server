import NotificationService from "@/services/NotificationService";
import webpush from "web-push";

// export type TNotificationAction = "openLink";
export type NotificationPayload = {
  title: string;
  body: string;
  link: string;
};
const PushNotificationService = {
  initWebPush() {
    const vapidKeys = {
      publicKey: process.env.PUBLIC_PUSH_NOTI_KEY,
      privateKey: process.env.PRIVATE_PUSH_NOTI_KEY,
    };

    if (!vapidKeys.publicKey) throw new Error(`Missing vapidKeys.publicKey`);
    if (!vapidKeys.privateKey) throw new Error(`Missing vapidKeys.privateKey`);

    webpush.setVapidDetails("mailto:2051012011binh@ou.edu.vn", vapidKeys.publicKey, vapidKeys.privateKey);
  },

  // triggerPushMsgAndForget(subscription: webpush.PushSubscription, dataToSend: string | Buffer | null | undefined) {
  //   webpush.sendNotification(subscription, dataToSend);
  // },
  async triggerPushMsg(subscription: webpush.PushSubscription, dataToSend: NotificationPayload) {
    try {
      return await webpush.sendNotification(subscription, JSON.stringify(dataToSend));
    } catch (err: any) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log("Subscription has expired or is no longer valid: ", err);

        await NotificationService.deleteSubscribe(subscription.endpoint);
      } else {
        console.log(`🚀 ~ triggerPushMsg ~ err:`, err);
        // throw err;
      }
    }
  },
};

export default PushNotificationService;
