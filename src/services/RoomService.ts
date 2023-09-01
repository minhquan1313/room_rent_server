import { Room } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation } from "@/models/Room/RoomLocation";
import { TRoomService } from "@/models/Room/RoomService";
import { RoomType, TRoomType } from "@/models/Room/RoomType";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import { Types } from "mongoose";

export type TRoomJSON = {
  owner?: string;
  room_type: TRoomType;
  name: string;

  services?: TRoomService[];

  // id of services
  images?: string[];

  location: Omit<IRoomLocation, "_id" | "room" | "updatedAt" | "createdAt">;

  sub_name?: string;
  description?: string;
  price_per_month: number;
  usable_area?: number;
  number_of_room?: number;
  number_of_bedroom?: number;
  number_of_bathroom?: number;
  number_of_floor: number;
};

class RoomService {
  async getAll(query?: Record<string, any>) {
    const docs = await Room.findPopulated({});

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

    return await (await Room.findById(room._id))?.populateAll();
  }
  async newImageUploaded(roomId: string | Types.ObjectId, src: string) {
    const ri = await RoomImage.create({
      room: roomId,
      image: src,
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
