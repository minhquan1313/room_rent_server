import { proximityThreshold } from "@/constants/constants";
import { IRoom, Room, populatePaths } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation } from "@/models/Room/RoomLocation";
import { RoomService as RoomService_, TRoomService } from "@/models/Room/RoomService";
import { RoomType, TRoomType } from "@/models/Room/RoomType";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
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
export interface RoomSearchQuery extends TCommonQuery {
  kw?: string;

  services?: string[];
  room_type?: string;
  province?: string;
  district?: string;
  ward?: string;

  usable_area: number;
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

  sort_field?: string;
  sort?: 1 | -1;
  disabled?: boolean;
  search_close_to?: string | boolean;
  search_close_to_lat?: string;
  search_close_to_long?: string;

  projection?: string;

  // owner?: string;
  // ...
  // ?services=wifi,mt
  // ?room_type=cc,nr
  // ?kw=adwdawd
  // ?province=ben tre
  // ?district=adad
  // ?ward=adwwd
}
class RoomService {
  async getAll(query2: RoomSearchQuery) {
    const {
      count,
      saved,
      disabled,

      limit = "99",
      page = "1",

      services,
      kw,
      room_type,
      province,
      district,
      ward,

      usable_area_from,
      usable_area_to,
      price_per_month_from,
      price_per_month_to,
      number_of_living_room_from,
      number_of_living_room_to,
      number_of_bedroom_from,
      number_of_bedroom_to,
      number_of_bathroom_from,
      number_of_bathroom_to,
      number_of_floor_from,
      number_of_floor_to,

      search_close_to,
      search_close_to_lat,
      search_close_to_long,

      sort_field,
      sort,

      projection,

      ...query
    } = query2;

    const searchQuery: FilterQuery<IRoom> = query;
    if ("owner" in searchQuery) searchQuery.owner = new Types.ObjectId(searchQuery.owner);

    if (services) {
      // const splitted = services.split(",");

      const serviceIds = (
        await RoomService_.find({
          title: { $in: services },
          // title: { $in: splitted },
        })
      ).map((r) => r._id.toString());
      console.log(`🚀 ~ RoomService ~ getAll ~ serviceIds:`, serviceIds);

      // OR Condition (Have some the services user provided)
      searchQuery.services = {
        $in: serviceIds,
      };

      // AND Condition (Must have all the services user provided)
      // searchQuery.services = serviceIds;
    }

    if (room_type) {
      const id = await RoomType.findOne({ title: room_type });

      searchQuery.room_type = id ?? undefined;
    }

    if (kw) {
      searchQuery.$text = { $search: kw };
    }

    if (price_per_month_from) {
      const [from, to] = [price_per_month_from, price_per_month_to];

      searchQuery.price_per_month = {
        $gte: from,
      };

      if (to) {
        searchQuery.price_per_month = {
          $gte: from,
          $lte: to,
        };
      }
    }
    if (usable_area_from) {
      const [from, to] = [usable_area_from, usable_area_to];

      searchQuery.usable_area = {
        $gte: from,
      };

      if (to) {
        searchQuery.usable_area = {
          $gte: from,
          $lte: to,
        };
      }
    }
    if (number_of_living_room_from) {
      const [from, to] = [number_of_living_room_from, number_of_living_room_to];

      searchQuery.number_of_living_room = {
        $gte: from,
      };

      if (to) {
        searchQuery.number_of_living_room = {
          $gte: from,
          $lte: to,
        };
      }
    }
    if (number_of_bedroom_from) {
      const [from, to] = [number_of_bedroom_from, number_of_bedroom_to];

      searchQuery.number_of_bedroom = {
        $gte: from,
      };

      if (to) {
        searchQuery.number_of_bedroom = {
          $gte: from,
          $lte: to,
        };
      }
    }
    if (number_of_bathroom_from) {
      const [from, to] = [number_of_bathroom_from, number_of_bathroom_to];

      searchQuery.number_of_bathroom = {
        $gte: from,
      };

      if (to) {
        searchQuery.number_of_bathroom = {
          $gte: from,
          $lte: to,
        };
      }
    }
    if (number_of_floor_from) {
      const [from, to] = [number_of_floor_from, number_of_floor_to];

      searchQuery.number_of_floor = {
        $gte: from,
      };

      if (to) {
        searchQuery.number_of_floor = {
          $gte: from,
          $lte: to,
        };
      }
    }

    if (search_close_to === "true" || province || district || ward) {
      let roomLocations: IRoomLocation[] = [];

      if (search_close_to === "true") {
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

    console.log(`🚀 ~ RoomService ~ getAll ~ saved:`, saved);
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

    q.sort({
      [sort_field || "createdAt"]: sort || -1,
    });
    // q.sort([[sort_field || "createdAt", sort || -1]]);

    if (limit !== 0) {
      q.skip(Number(limit) * (Number(page) - 1));
      q.limit(Number(limit));
    }

    // if (projection) {
    // q.distinct(projection);
    // }

    if (count !== undefined) {
      const [count, data] = await Promise.all([qCount.exec(), q.exec()]);
      await Room.populate(data, populatePaths);

      return { data, count };

      // const countDoc = await queryCount.exec();
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

    return await room.updateOne({
      ...rest,
      room_type: (room_type && (await RoomType.findOne({ title: room_type }))) || undefined,
    });
  }

  async delete(roomId: string | Types.ObjectId) {
    const room = await Room.findById(roomId);
    if (!room) return false;

    await RoomLocation.deleteOne({ room });
    await RoomWithRoomService.deleteMany({ room });

    // TODO: make services to unlink
    await RoomImage.deleteMany({ room });
  }
  async deleteMany(roomsId: string[]) {
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
