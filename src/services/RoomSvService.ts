import { IRoomService, RoomService } from "@/models/Room/RoomService";
import { RoomServiceCategory } from "@/models/Room/RoomServiceCategory";
import { ModelToPayload } from "@/types/ModelToPayload";
import { TCommonQuery } from "@/types/TCommonQuery";

type TPayload = ModelToPayload<IRoomService>;
class RoomSvService {
  async update(id: string, payload: TPayload) {
    const doc = await RoomService.findOne({
      _id: id,
    });

    if (!doc) return false;
    console.log(`🚀 ~ RoomSvService ~ update ~ doc:`, doc);

    const { category, ...toUpdate } = payload;
    if (category) {
      (toUpdate as any).category = await RoomServiceCategory.findOne(category as any);
    }

    await doc.updateOne(toUpdate);

    return true;
  }

  async add(payload: TPayload) {
    const { category, ...data } = payload;

    if (category) {
      const doc = await RoomServiceCategory.findOne(category as any);
      doc && ((data as TPayload)["category"] = String(doc._id));
    }

    return await RoomService.create(data);
  }

  async delete(id: string) {
    const doc = await RoomService.findOne({
      _id: id,
    });

    await doc?.deleteOne();
  }

  async list(qq?: TCommonQuery) {
    return await RoomService.findPopulated(qq).sort({ createdAt: -1 }).lean();
  }
}

export default new RoomSvService();
