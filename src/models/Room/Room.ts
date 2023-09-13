import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation, RoomLocationDocument } from "@/models/Room/RoomLocation";
import { RoomService, RoomServiceDocument, TRoomService } from "@/models/Room/RoomService";
import { RoomType } from "@/models/Room/RoomType";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import { User } from "@/models/User/User";
import RoomImageService from "@/services/RoomImageService";
import UploadService from "@/services/UploadService";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { check } from "express-validator";
import { FilterQuery, Model, Schema, Types, isValidObjectId, model } from "mongoose";

export interface IRoom {
  _id: Types.ObjectId;

  owner: Types.ObjectId;
  room_type: Types.ObjectId;
  location: Types.ObjectId | null;
  images: Types.ObjectId[];
  services: Types.ObjectId[];

  name: string;
  sub_name: string | null;
  description: string | null;

  price_per_month: number;
  price_currency_code: string;

  usable_area: number | null;
  usable_area_unit: string | null;

  number_of_living_room: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  number_of_floor: number;

  available: boolean;
  disabled: boolean;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomMethods {
  getServices(): Promise<RoomServiceDocument[]>;
  addOrUpdateServices(services: TRoomService[]): Promise<void>;
  addOrUpdateImages(imagesIds: string[]): Promise<void>;
  addOrUpdateLocation(locationDetail: Omit<IRoomLocation, "_id" | "room" | "updatedAt" | "createdAt">): Promise<void>;
  getLocation(): Promise<RoomLocationDocument | null>;

  populateAll(): Promise<RoomDocument>;
}

interface RoomModel extends Model<IRoom, {}, IRoomMethods> {
  // static methods
  findPopulated(query: FilterQuery<IRoom>): Promise<RoomDocument[]>;
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
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "RoomService",
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
    price_currency_code: {
      type: String,
      required: true,
    },
    usable_area: {
      // square meters
      type: Number,
      default: null,
    },
    usable_area_unit: {
      // square meters
      type: String,
      default: null,
    },
    number_of_living_room: {
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

    available: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      async addOrUpdateServices(this: RoomDocument, services): Promise<void> {
        const rwrs = await RoomWithRoomService.find({ room: this._id }).populate("service");

        // id of RoomService, NOT RoomWithRoomService._id
        const currentServicesId = rwrs.map((r) => {
          return (r.service as unknown as RoomServiceDocument)._id.toString();
        });

        // Make sure param _imagesId has real id in collection
        const servicesId = (
          await RoomService.find({
            title: {
              $in: services,
            },
          })
        ).map((r) => r._id.toString());

        const idsToDelete = currentServicesId.filter((id) => !servicesId.includes(id));
        if (idsToDelete.length) {
          await RoomWithRoomService.deleteMany({
            room: this._id,
            service: {
              $in: idsToDelete,
            },
          });
        }

        this.services = servicesId as any;
        await this.save();
      },
      async addOrUpdateImages(this: RoomDocument, _imagesId): Promise<void> {
        const currentImagesId = this.images.map((r) => r.toString());

        // Make sure param _imagesId has real id in collection
        const imagesId = (
          await RoomImage.find({
            _id: {
              $in: _imagesId,
            },
          })
        ).map((r) => r._id.toString());

        const idsToDelete = currentImagesId.filter((id) => !imagesId.includes(id));
        if (idsToDelete.length) {
          const imagesToDelete = await RoomImage.find({
            _id: {
              $in: idsToDelete,
            },
          });

          for await (const imageToDelete of imagesToDelete) {
            await imageToDelete.deleteOne();
          }

          const sourcesToDelete = imagesToDelete.map((r) => r.image);
          sourcesToDelete.forEach((src) => {
            try {
              UploadService.unLinkUserFileSync(src);
            } catch (error) {
              console.log(`🚀 ~ sources.forEach ~ error during deleting room image: `, src);
            }
          });
        }

        const roomImages = await RoomImageService.reOrderImages(this._id.toString());

        this.images = roomImages.map((r) => r._id);
        await this.save();
      },

      async addOrUpdateLocation(this: RoomDocument, locationDetail) {
        if (this.location) {
          // already has a location
          const locationDoc = await RoomLocation.findById(this.location);
          if (!locationDoc) {
            // location not in collection
            await RoomLocation.create({
              ...locationDetail,
              _id: this.location,
              room: this._id,
            });

            return;
          }

          await RoomLocation.findOneAndUpdate(
            {
              _id: this.location,
            },
            {
              ...locationDetail,
              room: this._id,
            }
          );
          console.log(`🚀 ~ addOrUpdateLocation ~ locationDetail:`, locationDetail);
        } else {
          const locationDoc = await RoomLocation.create({
            ...locationDetail,
            room: this._id,
          });

          this.location = locationDoc._id;
          await this.save();
        }

        return;
      },

      async getLocation(this: RoomDocument) {
        return await RoomLocation.findOne({ room: this._id });
      },

      async populateAll(this: RoomDocument) {
        return await this.populate([
          {
            path: "owner",
            // populate: [
            //   {
            //     path: "gender",
            //   },
            //   {
            //     path: "role",
            //   },
            //   {
            //     path: "phone",
            //   },
            //   {
            //     path: "email",
            //   },
            // ],
          },
          {
            path: "room_type",
          },
          {
            path: "location",
          },
          {
            path: "images",
          },
          {
            path: "services",
          },
        ]);
      },
    },
    statics: {
      async findPopulated(query) {
        return await model("Room")
          .find(query)
          .populate([
            {
              path: "owner",
              // populate: [
              //   {
              //     path: "gender",
              //   },
              //   {
              //     path: "role",
              //   },
              //   {
              //     path: "phone",
              //   },
              //   {
              //     path: "email",
              //   },
              // ],
            },
            {
              path: "room_type",
            },
            {
              path: "location",
            },
            {
              path: "images",
            },
            {
              path: "services",
            },
          ]);
      },
    },
  }
);
schema.index({
  name: "text",
  sub_name: "text",
  description: "text",
});

// schema.pre("find", function (next) {
//   this.sort({
//     createdAt: -1,
//   });

//   next();
// });

const Room = model<IRoom, RoomModel>("Room", schema);

const validateAddRoom = () => {
  return [
    check("owner", "Chủ sở hữu không tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await User.findOne({ _id: req.body.owner });
        if (!doc) throw new Error();
      }),

    check("room_type", "Kiểu phòng không tồn tại").custom(async (value, { req }) => {
      const doc = await RoomType.findOne({ title: req.body.room_type });
      if (!doc) throw new Error();
    }),

    check("name", "Thiếu tên phòng").optional().not().isEmpty(),

    check("price_per_month", "Thiếu giá phòng").not().isEmpty(),
    check("price_per_month", "Giá không hợp lệ").isNumeric(),

    check("location", "Vị trí phải là object").isObject(),
    check("location.lat", "Cung cấp lat").if(check("location").exists()).not().isEmpty(),
    check("location.lat", "Lat phải là số").if(check("location").exists()).isNumeric(),

    check("location.long", "Cung cấp long").if(check("location").exists()).not().isEmpty(),
    check("location.long", "Long phải là số").if(check("location").exists()).isNumeric(),

    check("location.country", "Cung cấp quốc gia").optional().if(check("location").exists()).not().isEmpty(),

    check("location.province", "Cung cấp province").if(check("location").exists()).not().isEmpty(),
    // check("location.province_code", "Cung cấp province_code").if(check("location").exists()).not().isEmpty(),
    // check("location.province_code", "province_code phải là số").if(check("location").exists()).isNumeric(),

    check("location.district", "Cung cấp district").if(check("location").exists()).not().isEmpty(),
    // check("location.district_code", "Cung cấp district_code").if(check("location").exists()).not().isEmpty(),
    // check("location.district_code", "district_code phải là số").if(check("location").exists()).isNumeric(),

    check("location.ward", "Cung cấp ward").if(check("location").exists()).not().isEmpty(),
    // check("location.ward_code", "Cung cấp ward_code").if(check("location").exists()).not().isEmpty(),
    // check("location.ward_code", "ward_code phải là số").if(check("location").exists()).isNumeric(),

    check("location.detail_location", "Cung cấp detail_location").if(check("location").exists()).not().isEmpty(),

    check("services", "Dịch vụ sai").optional().isArray(),
    check("services", "Có 1 số dịch vụ không tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await RoomService.find({
          title: req.body.services,
        });
        if (!doc) throw new Error();
      }),
  ];
};

const validateEditRoom = () => {
  return [
    check("owner", "Chủ sở hữu không tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await User.findOne({ _id: req.body.owner });
        if (!doc) throw new Error();
      }),
    check("roomId", "Phòng không tồn tại").custom(async (value, { req }) => {
      if (!req.params?.roomId || !isValidObjectId(req.params.roomId)) throw new Error();

      const doc = await Room.findOne({ _id: req.params.roomId });
      if (!doc) throw new Error();
    }),

    check("room_type", "Kiểu phòng không tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await RoomType.findOne({ title: req.body.room_type });
        if (!doc) throw new Error();
      }),

    check("name", "Thiếu tên phòng").optional().not().isEmpty(),

    check("price_per_month", "Thiếu giá phòng").optional().not().isEmpty(),
    check("price_per_month", "Giá không hợp lệ").optional().isNumeric(),

    check("location", "Vị trí phải là object").optional().isObject(),
    check("location.lat", "Cung cấp lat").optional().if(check("location").exists()).not().isEmpty(),
    check("location.lat", "Lat phải là số").optional().if(check("location").exists()).isNumeric(),

    check("location.long", "Cung cấp long").optional().if(check("location").exists()).not().isEmpty(),
    check("location.long", "Long phải là số").optional().if(check("location").exists()).isNumeric(),

    check("location.country", "Cung cấp quốc gia").optional().if(check("location").exists()).not().isEmpty(),

    check("location.province", "Cung cấp tỉnh").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.province_code", "Cung cấp province_code").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.province_code", "province_code phải là số").optional().if(check("location").exists()).isNumeric(),

    // check("location.district", "Cung cấp Huyện/Thị xã/Thành phố").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.district_code", "Cung cấp district_code").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.district_code", "district_code phải là số").optional().if(check("location").exists()).isNumeric(),

    // check("location.ward", "Cung cấp Xã/Phường/Thị trấn").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.ward_code", "Cung cấp ward_code").optional().if(check("location").exists()).not().isEmpty(),
    // check("location.ward_code", "ward_code phải là số").optional().if(check("location").exists()).isNumeric(),

    check("location.detail_location", "Cung cấp detail_location").optional().if(check("location").exists()).not().isEmpty(),

    check("services", "Dịch vụ phải là mảng").optional().isArray(),
    check("services", "Có 1 số dịch vụ không tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await RoomService.find({
          title: req.body.services,
        });
        if (!doc) throw new Error();
      }),

    check("images", "Ảnh phải là mảng").optional().isArray(),
  ];
};

export { Room, validateAddRoom, validateEditRoom };
