import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation, RoomLocationDocument } from "@/models/Room/RoomLocation";
import { RoomService, RoomServiceDocument } from "@/models/Room/RoomService";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { check } from "express-validator";
import { Model, Schema, Types, model } from "mongoose";

export interface IRoom {
  _id: Types.ObjectId;

  owner: Types.ObjectId;
  room_type: Types.ObjectId;
  location: Types.ObjectId | null;
  images: Types.ObjectId[];

  name: string;
  sub_name: string | null;
  description: string | null;
  price_per_month: number;
  usable_area: number | null;
  number_of_room: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  number_of_floor: number;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomMethods {
  getServices(): Promise<RoomServiceDocument[]>;
  addOrUpdateServices(serviceIds: string[]): Promise<void>;
  addOrUpdateImages(imageIds: string[]): Promise<void>;
  addOrUpdateLocation(locationDetail: Omit<IRoomLocation, "_id" | "room" | "updatedAt" | "createdAt">): Promise<void>;
  getLocation(): Promise<RoomLocationDocument | null>;
}

interface RoomModel extends Model<IRoom, {}, IRoomMethods> {
  // static methods
  findByIdPopulated(id: string | Types.ObjectId): Promise<RoomDocument | null>;
}
export type RoomDocument = MongooseDocConvert<IRoom, IRoomMethods>;

const schema = new Schema<IRoom, RoomModel, IRoomMethods>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    room_type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "RoomType",
    },
    location: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "RoomLocation",
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "RoomImage",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    sub_name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    price_per_month: {
      type: Number,
      required: true,
    },
    usable_area: {
      // square meters
      type: Number,
      default: null,
    },
    number_of_room: {
      type: Number,
      default: null,
    },
    number_of_bedroom: {
      type: Number,
      default: null,
    },
    number_of_bathroom: {
      type: Number,
      default: null,
    },
    number_of_floor: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    methods: {
      async getServices(this: RoomDocument): Promise<RoomServiceDocument[]> {
        const servicesId = (await RoomWithRoomService.find({ room: this._id })).map((r) => r.service);
        const services_ = await RoomService.find({
          _id: {
            $in: [servicesId],
          },
        });

        // const services = (await RoomWithRoomService.find({ room: this._id }).populate("service")).map((r) => r.service);

        // return services as unknown as RoomServiceDocument[];

        return services_;
      },
      async addOrUpdateServices(this: RoomDocument, servicesId: string[]): Promise<void> {
        const currentServicesId = (await RoomWithRoomService.find({ room: this._id })).map((r) => r.service.toString());

        const servicesToDelete = currentServicesId.filter((id) => !servicesId.includes(id));
        if (servicesToDelete.length)
          await RoomWithRoomService.deleteMany({
            room: this._id,
            service: {
              $in: [servicesToDelete],
            },
          });

        const servicesToAdd = servicesId.filter((id) => !currentServicesId.includes(id));
        if (servicesToAdd.length) {
          const obj = servicesToAdd.map((r) => ({
            room: this._id,
            service: r,
          }));

          await RoomWithRoomService.insertMany(obj);
        }
      },
      async addOrUpdateImages(this: RoomDocument, imagesId): Promise<void> {
        const currentImagesId = this.images.map((r) => r.toString());

        const idsToDelete = currentImagesId.filter((id) => !imagesId.includes(id));
        if (idsToDelete.length)
          await RoomImage.deleteMany({
            room: this._id,
            image: {
              $in: [idsToDelete],
            },
          });

        const idsToAdd = imagesId.filter((id) => !currentImagesId.includes(id));
        if (idsToAdd.length) {
          const obj = idsToAdd.map((r) => ({
            room: this._id,
            image: r,
          }));

          await RoomImage.insertMany(obj);
        }

        const imageNotDeleted = currentImagesId.filter((id) => !idsToDelete.includes(id));

        const newImgIds = [...imageNotDeleted, ...idsToAdd];

        this.images = newImgIds as any;
        await this.save();
      },

      async addOrUpdateLocation(this: RoomDocument, locationDetail) {
        if (this.location) {
          // already has a email
          const locationDoc = await RoomLocation.findById(this.location);
          if (!locationDoc) {
            // email not in collection
            await RoomLocation.create({
              _id: this.location,
              room: this._id,
              ...locationDetail,
            });

            return;
          }

          await RoomLocation.findOneAndUpdate(
            {
              _id: this.location,
            },
            locationDetail
          );
        } else {
          const locationDoc = await RoomLocation.create({
            room: this._id,
            ...locationDetail,
          });

          this.location = locationDoc._id;
          await this.save();
        }

        return;
      },

      async getLocation(this: RoomDocument) {
        return await RoomLocation.findOne({ room: this._id });
      },
    },
    statics: {
      async findByIdPopulated(id) {
        return await model("Room").findById(id).populate("owner").populate("room_type").populate("location").populate("images");
      },
    },
  }
);

// schema.pre("find", function (next) {
//   this.sort({
//     createdAt: -1,
//   });

//   next();
// });

const Room = model<IRoom, RoomModel>("Room", schema);

const validateAddRoom = () => {
  return [
    // check("owner", "Thiếu chủ sở hữu").not().isEmpty(),
    check("room_type", "Thiếu kiểu phòng").not().isEmpty(),
    check("name", "Thiếu tên phòng").not().isEmpty(),

    check("price_per_month", "Thiếu giá phòng").not().isEmpty(),
    check("price_per_month", "Thiếu giá không hợp lệ").isNumeric(),

    check("location", "Thiếu vị trí").isObject(),
    check("location.lat", "Cung cấp lat")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.lat", "Lat phải là số")
      //
      .if(check("location").exists())
      .isNumeric(),
    check("location.long", "Cung cấp long")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.province", "Cung cấp province")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.province_code", "Cung cấp province_code")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.district", "Cung cấp district")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.district_code", "Cung cấp district_code")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.ward", "Cung cấp ward")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.ward_code", "Cung cấp ward_code")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),
    check("location.detail_location", "Cung cấp detail_location")
      //
      .if(check("location").exists())
      .not()
      .isEmpty(),

    check("services", "Dịch vụ sai").optional().isArray(),
  ];
};

export { Room, validateAddRoom };
