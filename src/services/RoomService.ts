import { IRoom, Room } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation } from "@/models/Room/RoomLocation";
import { RoomService as RoomService_, TRoomService } from "@/models/Room/RoomService";
import { RoomType, TRoomType } from "@/models/Room/RoomType";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import UploadService from "@/services/UploadService";
import { FilterQuery, Types } from "mongoose";

export type TRoomJSON = {
  owner?: string;
  room_type: TRoomType;
  name: string;

  services?: TRoomService[];

  // id of services
  images?: string[];
  imagesOrders?: number[];

  location: Omit<IRoomLocation, "_id" | "room" | "updatedAt" | "createdAt">;

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

  available?: boolean;
};
export interface RoomSearchQuery {
  services?: string;
  room_type?: string;
  kw?: string;
  province?: string;
  district?: string;
  ward?: string;

  pageSize?: number;
  page?: number;

  number_of_floor?: number;
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
  async getAll({ pageSize = 100, page = 1, services, room_type, kw, province, district, ward, ...query }: RoomSearchQuery) {
    const searchQuery: FilterQuery<IRoom> = { ...query };
    if (services) {
      const splitted = services.split(",");

      const serviceIds = (
        await RoomService_.find({
          title: { $in: splitted },
        })
      ).map((r) => r._id.toString());
      console.log(`🚀 ~ RoomService ~ getAll ~ serviceIds:`, serviceIds);

      // OR Condition (Have some the services user provided)
      // searchQuery.services = {
      //   $in: serviceIds,
      // };

      // AND Condition (Must have all the services user provided)
      searchQuery.services = serviceIds;
    }
    if (room_type) {
      const id = await RoomType.findOne({ title: room_type });

      searchQuery.room_type = id ?? undefined;
    }
    if (kw) {
      searchQuery.$text = { $search: kw };
    }
    if (province || district || ward) {
      const obj: FilterQuery<IRoomLocation> = {};
      if (province) obj.province = province;
      if (district) obj.district = district;
      if (ward) obj.ward = ward;

      const roomLocations = await RoomLocation.find(obj);

      const lIds = roomLocations.map((r) => r._id.toString());

      searchQuery.location = {
        $in: lIds,
      };
    }

    console.log(`🚀 ~ RoomService ~ getAll ~ searchQuery:`, searchQuery);
    // const docs = await Room.findPopulated({
    console.log(`🚀 ~ RoomService ~ getAll ~ console:`, {
      ...searchQuery,
    });

    //   ...searchQuery,
    // });
    const docs = await Room.find({
      ...searchQuery,
    })
      .sort({
        createdAt: -1,
      })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    for await (const doc of docs) {
      await doc.populateAll();
    }

    return docs;
  }
  async create(userId: string | Types.ObjectId, { services, room_type, images, location, ...rest }: TRoomJSON) {
    const room = await Room.create({
      ...rest,
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
      room_type: room_type ? (await RoomType.findOne({ title: room_type })) ?? undefined : undefined,
    });

    return await (await Room.findById(roomId))?.populateAll();
  }
  async roomImagesUpload(files: Express.Multer.File[], userId: string, roomId: string, autoOrder: boolean | number[] = false) {
    const uploadedImageIds: string[] = [];

    let orders: (undefined | number)[];

    if (autoOrder === true) {
      orders = files.map((r, i) => i + 1);
    } else if (Array.isArray(autoOrder)) {
      orders = files.map((r, i) => autoOrder[i]);
    } else {
      orders = Array(files.length).fill(undefined);
    }
    console.log(`🚀 ~ RoomService ~ roomImagesUpload ~ autoOrder:`, autoOrder);
    console.log(`🚀 ~ RoomService ~ roomImagesUpload ~ orders:`, orders);

    let i = 0;
    for await (const file of files) {
      const newPath = await UploadService.userRoomImageFileUpload(file, userId, roomId);
      const roomImage = await this.newImageUploaded(roomId, newPath.srcForDb, orders[i++]);

      uploadedImageIds.push(roomImage._id.toString());
    }

    return uploadedImageIds;
  }
  async newImageUploaded(roomId: string | Types.ObjectId, src: string, order?: number) {
    const ri = await RoomImage.create({
      room: roomId,
      image: src,
      order,
    });

    return ri;
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
