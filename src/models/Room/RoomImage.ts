import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { Model, Schema, Types, model } from "mongoose";

export interface IRoomImage {
  _id: Types.ObjectId;

  room: Types.ObjectId;
  image: string;
  order: number | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomImageMethods {
  //  methods
}

interface RoomImageModel extends Model<IRoomImage, {}, IRoomImageMethods> {
  // static methods
  reOrderImages(roomId: string): Promise<RoomImageDocument[]>;
  reOrderImagesWithIdsOrdered(_ids: string[], start?: number): Promise<void>;
}
export type RoomImageDocument = MongooseDocConvert<IRoomImage, IRoomImageMethods>;

const schema = new Schema<IRoomImage, RoomImageModel, IRoomImageMethods>(
  {
    room: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    statics: {
      async reOrderImages(roomId: string) {
        const imgs = await model<IRoomImage, RoomImageModel>("RoomImage")
          .find({
            room: roomId,
          })
          .sort({
            order: 1,
            updatedAt: -1,
          });

        // const min = imgs[0].order;
        // const max = imgs[imgs.length - 1].order;

        const nullOrderImgs = imgs.filter((r) => r.order === null);
        const nonNullOrderImgs = imgs.filter((r) => r.order !== null);

        let i = 1;
        for await (const img of [...nonNullOrderImgs, ...nullOrderImgs]) {
          let order = i++;
          console.log(`🚀 ~ forawait ~ img.order:`, img.order, img.image);
          if (img.order === order) continue;

          img.order = order;
          await img.save();
        }

        console.log(`🚀 ~ reOrderImages ~ imgs:`, imgs.map((r) => `"${r._id.toString()}"`).join(","));

        return imgs;
      },

      async reOrderImagesWithIdsOrdered(_ids: string[], start = 1): Promise<void> {
        let i = start;
        for await (const _id of _ids) {
          await model<IRoomImage, RoomImageModel>("RoomImage").updateOne(
            {
              _id,
            },
            {
              order: i++,
            }
          );
        }
      },
    },
  }
);

const RoomImage = model<IRoomImage, RoomImageModel>("RoomImage", schema);

export { RoomImage };
