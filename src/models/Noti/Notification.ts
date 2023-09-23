import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface INotification {
  _id: Types.ObjectId;

  user: Types.ObjectId;

  endpoint: string;

  keys: {
    p256dh: string;
    auth: string;
  };

  updatedAt: Date;
  createdAt: Date;
}
interface INotificationMethods {
  //  methods
}

interface NotificationModel extends Model<INotification, {}, INotificationMethods> {
  // static methods
}
export type NotificationDocument = MongooseDocConvert<INotification, INotificationMethods>;

const schema = new Schema<INotification, NotificationModel, INotificationMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    endpoint: {
      type: String,
      unique: true,
    },

    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    statics: {},
  }
);
export const Notification = mongoose.model<INotification, NotificationModel>("Notification", schema);
