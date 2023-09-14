import { autoTitle } from "@/Utils/autoTitle";
import { RoomServiceDocument } from "@/models/Room/RoomService";
import { RoomServiceCategory, RoomServiceCategoryDocument } from "@/models/Room/RoomServiceCategory";
import { RoomServiceInCategory } from "@/models/Room/RoomServiceInCategory";

export type RoomServiceCategoryPayload = {
  display_name: string;
};
export type ServicesInCategory = {
  category: RoomServiceCategoryDocument;
  services: RoomServiceDocument[];
};
class RoomServiceCategoryService {
  async addCategory({ display_name }: RoomServiceCategoryPayload) {
    if (!display_name) return null;
    display_name = display_name.trim();

    const title = autoTitle(display_name);

    return await RoomServiceCategory.create({ display_name, title });
  }

  async addServiceToCategory(service: string, category: string) {
    return await RoomServiceInCategory.create({
      category,
      service,
    });
  }

  async getServicesInCategory() {
    const items: ServicesInCategory[] = await RoomServiceInCategory.aggregate([
      {
        $lookup: {
          from: "roomservices",
          localField: "service",
          foreignField: "_id",
          as: "service_info",
        },
      },
      {
        $lookup: {
          from: "roomservicecategories",
          localField: "category",
          foreignField: "_id",
          as: "category_info",
        },
      },
      {
        $unwind: "$service_info",
      },
      {
        $unwind: "$category_info",
      },
      {
        $project: {
          _id: 0,
          "category_info.title": 1, // Chọn trường title của category_info
          service_info: 1, // Giữ nguyên thông tin service_info
          category: {
            $cond: {
              if: { $eq: ["$category_info", null] },
              then: "unknown",
              else: "$category_info", // Giữ nguyên giá trị category_info
            },
          },
        },
      },
      {
        $group: {
          _id: "$category", // Nhóm theo category thay vì category.title
          category: { $first: "$category" },
          services: { $push: "$service_info" },
        },
      },
    ]);

    return items;
  }
}

export default new RoomServiceCategoryService();
