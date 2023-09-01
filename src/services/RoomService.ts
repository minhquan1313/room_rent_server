import { Room } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { IRoomLocation, RoomLocation } from "@/models/Room/RoomLocation";
import { RoomWithRoomService } from "@/models/Room/RoomWithRoomService";
import { Types } from "mongoose";

export type TRoomJSON = {
  room_type: string;
  name: string;

  // id of services
  services?: string[];
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
  async getAll(query: Record<string, any>) {
    const docs = await Room.find({})
      //
      .populate("owner")
      .populate("room_type")
      .populate("location");

    return docs;
  }
  async create(userId: string | Types.ObjectId, { services, images, location, ...rest }: TRoomJSON) {
    const room = await Room.create({
      ...rest,
      owner: userId,
    });

    const x: TRoomJSON = {
      room_type: "",
      name: "",
      location: {
        lat: 0,
        long: 0,
        province: "",
        province_code: 0,
        district: "",
        district_code: 0,
        ward: "",
        ward_code: 0,
        detail_location: "",
      },
      price_per_month: 0,
      number_of_floor: 0,
    };

    if (services) await room.addOrUpdateServices(services);
    if (location) await room.addOrUpdateLocation(location);
    if (images) await room.addOrUpdateImages(images);

    return await Room.findByIdPopulated(room._id);
  }
  async update(roomId: string | Types.ObjectId, { services, images, location, ...rest }: Partial<TRoomJSON>) {
    const room = await Room.findById(roomId);
    if (!room) throw new Error(`Can't find room`);

    if (services) await room.addOrUpdateServices(services);
    if (location) await room.addOrUpdateLocation(location);
    if (images) await room.addOrUpdateImages(images);

    await room.updateOne(rest);

    return await Room.findByIdPopulated(room._id);
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
