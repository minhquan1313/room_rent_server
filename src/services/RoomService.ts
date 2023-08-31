import { Room } from "@/models/Room/Room";
import { TRole } from "@/models/User/Role";

export interface RoomFormData {}

class RoomService {
  async getAll(query: Record<string, any>) {
    const docs = await Room.find({}).populate("email").populate("tel").populate("role").populate("gender");

    return docs;
  }
}

export default new RoomService();
