import { provinceImagePathResolve } from "@/Utils/provinceImagePathResolve";
import { RoomLocation } from "@/models/Room/RoomLocation";

type CountRoom = {
  province: string;
  count: number;
  image: string;
};
class StatsServices {
  async countRoomProvince(province: string) {
    const count = await RoomLocation.countDocuments({ province });

    const z: CountRoom = {
      province,
      count,
      image: provinceImagePathResolve(province),
    };

    return z;
  }
  async countRoom({ limit = "100" }: Record<string, string>) {
    const z: CountRoom[] = await RoomLocation.aggregate([
      {
        $lookup: {
          from: "rooms", // Tên của collection chứa tài liệu IRoom
          localField: "room",
          foreignField: "_id",
          as: "room_info",
        },
      },
      {
        $unwind: "$room_info",
      },
      {
        $group: {
          _id: "$province", // Nhóm theo trường province
          province: { $first: "$province" }, // Lấy giá trị province
          count: { $sum: 1 }, // Đếm số phòng trong mỗi tỉnh
        },
      },
      {
        $sort: {
          count: -1, // Sắp xếp giảm dần theo trường count
          province: 1,
        },
      },
      {
        $limit: Number(limit), // Giới hạn kết quả cho 10 tài liệu
      },
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
        },
      },
    ]);

    z.forEach((r) => {
      r.image = provinceImagePathResolve(r.province);
    });

    return z;
  }
}

export default new StatsServices();
