import { Saved } from "@/models/User/Saved";

export interface TSaveRoomPayload {
  room: string;
}

class MiscService {
  async saveRoom(user: string, data: TSaveRoomPayload) {
    const { room } = data;
    //
    await Saved.create({
      room,
      user,
    });
  }
}

export default new MiscService();
