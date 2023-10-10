import { proximityThreshold } from "@/constants/constants";
import { IRoom, Room, populatePaths } from "@/models/Room/Room";
import { IRoomLocation, RoomLocation } from "@/models/Room/RoomLocation";
import { RoomService as RoomService_, TRoomService } from "@/models/Room/RoomService";
import { RoomType, TRoomType } from "@/models/Room/RoomType";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import { Saved } from "@/models/User/Saved";
import RoomImageService from "@/services/RoomImageService";
import { ModelToPayload } from "@/types/ModelToPayload";
import { TCommonQuery } from "@/types/TCommonQuery";
import mongoose, { FilterQuery, Types } from "mongoose";

export interface TRoomLocationPayload extends Omit<IRoomLocation, "_id" | "room" | "updatedAt" | "createdAt" | "lat_long"> {
  lat: number;
  long: number;
}
export type TRoomJSON = {
  owner?: string;
  room_type: TRoomType;
  name: string;

  services?: TRoomService[];

  // id of services
  images?: string[];
  imagesOrders?: number[];

  location: TRoomLocationPayload;

  sub_name?: string;
  description?: string;

  price_per_month: number;
  price_currency_code: string;

  usable_area?: number;
  usable_area_unit: string | null;

  number_of_living_room?: number;
  number_of_bedroom?: number;
  number_of_bathroom?: number;
  number_of_floor?: number;
};

export interface RoomSearchQuery extends TCommonQuery, ModelToPayload<IRoom> {
  kw?: string;

  province?: string;
  district?: string;
  ward?: string;

  usable_area_from?: number;
  usable_area_to?: number;

  price_per_month_from?: number;
  price_per_month_to?: number;

  number_of_living_room_from?: number;
  number_of_living_room_to?: number;

  number_of_bedroom_from?: number;
  number_of_bedroom_to?: number;

  number_of_bathroom_from?: number;
  number_of_bathroom_to?: number;

  number_of_floor_from?: number;
  number_of_floor_to?: number;

  search_close_to?: string | boolean;
  search_close_to_lat?: string;
  search_close_to_long?: string;

  projection?: string;
}
class RoomService {
  async getAll(query2: RoomSearchQuery) {
    const {
      count,
      saved,

      limit = 99,
      page = 1,

      services,
      kw,
      room_type,
      province,
      district,
      ward,

      search_close_to,
      search_close_to_lat,
      search_close_to_long,

      sort_field,
      sort,

      projection,

      ...qq
    } = query2;
    console.log(`🚀 ~ RoomService ~ getAll ~ query2:`, query2);

    const searchQuery: FilterQuery<IRoom> = qq;
    if ("owner" in qq) searchQuery.owner = new Types.ObjectId(searchQuery.owner);
    if ("_id" in qq) searchQuery._id = new Types.ObjectId(qq._id);
    if ("name" in qq)
      searchQuery.name = {
        $regex: new RegExp(qq.name!, "i"),
      };

    if (services) {
      // if (Array.isArray(room_type)) {
      //   const ids = await RoomType.find({
      //     title: { $in: room_type },
      //   });
      //   console.log(`🚀 ~ RoomService ~ getAll ~ ids:`, ids);

      //   searchQuery.room_type = {
      //     $in: ids.map((r) => r._id),
      //   };
      // }
      // const splitted = services.split(",");

      const serviceIds = (
        await RoomService_.find({
          title: { $in: services },
          // title: { $in: splitted },
        })
      ).map((r) => r._id);
      console.log(`🚀 ~ RoomService ~ getAll ~ serviceIds:`, serviceIds);

      // OR Condition (Have some the services user provided)
      searchQuery.services = {
        $in: serviceIds,
      };

      // AND Condition (Must have all the services user provided)
      // searchQuery.services = serviceIds;
    }

    if (room_type !== undefined) {
      if (Array.isArray(room_type)) {
        const ids = (
          await RoomType.find({
            title: {
              $in: room_type,
            },
          })
        ).map((r) => r._id);

        searchQuery.room_type = { $in: ids };
      } else {
        const id = (
          await RoomType.findOne({
            title: room_type,
          })
        )?._id;

        searchQuery.room_type = id;
      }
    }

    if (kw) {
      searchQuery.$text = { $search: kw };
    }

    // from - to
    Object.keys(qq).forEach((key) => {
      const fromIndex = key.lastIndexOf("_from");
      const toIndex = key.lastIndexOf("_to");

      if (fromIndex !== -1) {
        const field = key.slice(0, fromIndex);
        searchQuery[field] = {
          ...searchQuery[field],
          $gte: qq[key],
        };

        delete searchQuery[key];
      } else if (toIndex !== -1) {
        const field = key.slice(0, toIndex);
        searchQuery[field] = {
          ...searchQuery[field],
          $lte: qq[key],
        };

        delete searchQuery[key];
      }
    });

    if (search_close_to === true || province || district || ward) {
      let roomLocations: IRoomLocation[] = [];

      if (search_close_to === true) {
        const lat = Number(search_close_to_lat);
        const long = Number(search_close_to_long);
        if (lat && long) {
          roomLocations = await RoomLocation.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [long, lat],
                },
                distanceField: "distance",
                maxDistance: proximityThreshold,
                spherical: true,
              },
            },
          ]);
          console.log(`🚀 ~ RoomService ~ getAll ~ roomLocations:`, roomLocations, long, lat);
        }
      } else {
        const obj: FilterQuery<IRoomLocation> = {};
        if (province) obj.province = province;
        if (district) obj.district = district;
        if (ward) obj.ward = ward;

        roomLocations = await RoomLocation.find(obj);
      }

      const lIds = roomLocations.map((r) => r._id);

      searchQuery.location = {
        $in: lIds,
      };
    }

    const qCount = Room.countDocuments({
      ...searchQuery,
    });
    const q = Room.aggregate([{ $match: searchQuery }]);
    console.log(`🚀 ~ RoomService ~ getAll ~ searchQuery:`, searchQuery);

    // const q = Room.findPopulated({
    //   ...searchQuery,
    // });

    // await Room.populate(q, populatePaths);

    if (saved !== undefined) {
      q.append({
        $lookup: {
          from: "saveds",
          localField: "_id",
          foreignField: "room",
          as: "saved",
        },
      });
    }

    if (["province", "district", "ward", "room_type"].includes(sort_field as any)) {
      if (sort_field === "room_type") {
        q.append({
          $lookup: {
            from: "roomtypes",
            foreignField: "_id",
            localField: "room_type",
            as: "room_type",
          },
        });
        q.append({
          $unwind: "$room_type",
        });
        q.append({
          $sort: {
            "room_type.display_name": sort || -1,
            createdAt: -1,
          },
        });
      } else {
        q.append({
          $lookup: {
            from: "roomlocations",
            foreignField: "_id",
            localField: "location",
            as: "location",
          },
        });
        q.append({
          $unwind: "$location",
        });

        const key = `location.${sort_field}`;

        q.append({
          $sort: {
            [key]: sort || -1,
            createdAt: -1,
          },
        });
      }
    } else {
      if (sort_field === "createdAt") {
        q.sort({
          [sort_field || "createdAt"]: sort || -1,
        });
      } else {
        q.sort({
          [sort_field || "createdAt"]: sort || -1,
          createdAt: -1,
        });
      }
    }

    if (limit !== 0) {
      q.skip(limit * (page - 1));
      q.limit(limit);
    }

    if (count !== undefined) {
      const [count, data] = await Promise.all([qCount.exec(), q.exec()]);
      await Room.populate(data, populatePaths);

      return { data, count };
    } else {
      const data = await q.exec();

      await Room.populate(data, populatePaths);
      return data;
    }
  }
  async get(id: string | Types.ObjectId, { ...query }: TCommonQuery) {
    const room = await Room.findPopulated({
      _id: id,
    });

    return room[0] ?? null;
  }
  async create(userId: string | Types.ObjectId, { services, room_type, images, location, ...rest }: TRoomJSON) {
    const _id = new mongoose.mongo.ObjectId();

    const room = await Room.create({
      ...rest,
      _id,
      room_type: await RoomType.findOne({ title: room_type }),
      owner: userId,
    });

    if (services) await room.addOrUpdateServices(services);
    if (location) await room.addOrUpdateLocation(location);
    if (images) await room.addOrUpdateImages(images);

    return await room.populateAll();
  }
  async update(roomId: string | Types.ObjectId, { services, room_type, images, location, ...rest }: Partial<TRoomJSON>) {
    const room = await Room.findById(roomId);
    if (!room) throw new Error(`Can't find room`);

    if (services) await room.addOrUpdateServices(services);
    if (location) await room.addOrUpdateLocation(location);
    if (images) await room.addOrUpdateImages(images);

    await room.updateOne({
      ...rest,
      room_type: (room_type && (await RoomType.findOne({ title: room_type }))) || undefined,
    });

    return true;
  }

  async delete(roomId: string | Types.ObjectId) {
    const room = await Room.findById(roomId);
    if (!room) return false;

    await RoomLocation.deleteMany({ room });
    await RoomWithRoomService.deleteMany({ room });

    // TODO: make services to unlink
    await RoomImageService.deleteImagesOfRoom(roomId);
    await Saved.deleteMany({ room: roomId });
  }
  async deleteMany(roomsId: (string | Types.ObjectId)[]) {
    for await (const id of roomsId) {
      await this.delete(id);
    }
  }
  async deleteManyByUserId(userId: string | Types.ObjectId) {
    const rooms = await Room.find({
      owner: userId,
    });

    for await (const room of rooms) {
      await this.delete(room._id);
    }
  }
}

export default new RoomService();
