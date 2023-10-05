import { autoTitle } from "@/Utils/autoTitle";
import { RoomServiceDocument } from "@/models/Room/RoomService";
import { IRoomServiceCategory, RoomServiceCategory, RoomServiceCategoryDocument } from "@/models/Room/RoomServiceCategory";

export type RoomServiceCategoryPayload = {
  display_name: string;
};
export type ServicesInCategory = {
  category: RoomServiceCategoryDocument | "unknown";
  services: RoomServiceDocument[];
};
class RoomServiceCategoryService {
  async list() {
    return await RoomServiceCategory.find();
  }
  async addCategory({ display_name }: RoomServiceCategoryPayload) {
    if (!display_name) return null;
    display_name = display_name.trim();

    const title = autoTitle(display_name);

    return await RoomServiceCategory.create({ display_name, title });
  }

  async update(id: string, payload: IRoomServiceCategory) {
    const doc = await RoomServiceCategory.findOne({
      _id: id,
    });

    if (!doc) return false;

    await doc.updateOne(payload);

    return true;
  }
  async delete(id: string) {
    const doc = await RoomServiceCategory.findOne({
      _id: id,
    });

    await doc?.deleteOne();
  }
}

export default new RoomServiceCategoryService();
