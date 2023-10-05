import { IRoomType, RoomType } from "@/models/Room/RoomType";
import { ModelToPayload } from "@/types/ModelToPayload";

type TPayload = ModelToPayload<IRoomType>;
class RoomTypeService {
  async update(id: string, payload: TPayload) {
    const doc = await RoomType.findOne({
      _id: id,
    });
    console.log(`🚀 ~ RoomTypeService ~ update ~ doc:`, doc, payload);

    await doc?.updateOne(payload);
  }

  async add(payload: TPayload) {
    return await RoomType.create(payload);
  }

  async delete(id: string) {
    const doc = await RoomType.findOne({
      _id: id,
    });

    await doc?.deleteOne();
  }

  async list() {
    return await RoomType.find().lean();
  }
}

export default new RoomTypeService();
