import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface INotification {
  _id: Types.ObjectId;

  user: Types.ObjectId;

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
    // display_name: {
    //   type: String,
    //   default: null,
    // },
  },
  {
    timestamps: true,
    statics: {},
  }
);
export const Notification = mongoose.model<INotification, NotificationModel>("Notification", schema);
