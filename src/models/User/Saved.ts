import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { Model, Schema, Types, model } from "mongoose";
export interface ISaved {
  _id: Types.ObjectId;

  user: Types.ObjectId;
  room: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface ISavedMethods {
  //  methods
}

interface SavedModel extends Model<ISaved, {}, ISavedMethods> {
  // static methods
}
export type SavedDocument = MongooseDocConvert<ISaved, ISavedMethods>;

const schema = new Schema<ISaved, SavedModel, ISavedMethods>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
  },
  {
    timestamps: true,
  }
);
schema.index({ user: 1, room: 1 }, { unique: true });

const Saved = model<ISaved, SavedModel>("Saved", schema);

export { Saved };
