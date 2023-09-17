import { autoTitle } from "@/Utils/autoTitle";
import { RoomServiceDocument } from "@/models/Room/RoomService";
import { RoomServiceCategory, RoomServiceCategoryDocument } from "@/models/Room/RoomServiceCategory";

export type RoomServiceCategoryPayload = {
  display_name: string;
};
export type ServicesInCategory = {
  category: RoomServiceCategoryDocument | "unknown";
  services: RoomServiceDocument[];
};
class RoomServiceCategoryService {
  async addCategory({ display_name }: RoomServiceCategoryPayload) {
    if (!display_name) return null;
    display_name = display_name.trim();

    const title = autoTitle(display_name);

    return await RoomServiceCategory.create({ display_name, title });
  }

  async getAll() {
    return await RoomServiceCategory.find();
  }

  // async addServiceToCategory(service: string, category: string) {
  //   return await RoomServiceInCategory.create({
  //     category,
  //     service,
  //   });
  // }

  // async getServicesInCategory() {
  //   const items: ServicesInCategory[] = await RoomServiceInCategory.aggregate([
  //     {
  //       $lookup: {
  //         from: "roomservices", // Tên của bảng RoomService
  //         localField: "service",
  //         foreignField: "_id",
  //         as: "service_info",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "roomservicecategories", // Tên của bảng RoomServiceCategory
  //         localField: "category",
  //         foreignField: "_id",
  //         as: "category_info",
  //       },
  //     },
  //     {
  //       $unwind: "$service_info",
  //     },
  //     {
  //       $unwind: "$category_info",
  //     },
  //     {
  //       $group: {
  //         _id: "$category_info._id", // Nhóm theo _id của RoomServiceCategory
  //         category: { $first: "$category_info" }, // Lấy thông tin đầu tiên của RoomServiceCategory
  //         services: { $push: "$service_info" }, // Tạo mảng services từ RoomService
  //       },
  //     },
  //   ]);

  //   const serviceIds = await RoomServiceInCategory.find().distinct("service");

  //   const notIn = await RoomService.find({
  //     _id: {
  //       $nin: serviceIds,
  //     },
  //   }).lean();

  //   if (notIn.length) {
  //     items.push({
  //       category: "unknown",
  //       services: notIn as any,
  //     });
  //   }

  //   return items;
  // }
}

export default new RoomServiceCategoryService();
