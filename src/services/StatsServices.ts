import { provinceImagePathResolve } from "@/Utils/provinceImagePathResolve";
import { Room } from "@/models/Room/Room";
import { RoomLocation } from "@/models/Room/RoomLocation";
import { User } from "@/models/User/User";
import { TCommonQuery } from "@/types/TCommonQuery";
import mongoose, { PipelineStage } from "mongoose";

type TCountData = {
  label: string;
  count: number;
  image?: string;
};
type TCountBy = "day" | "month" | "all";
class StatsServices {
  async countUserFromTo(from: Date, to: Date, countBy: TCountBy): Promise<TCountData[]> {
    console.log(`🚀 ~ StatsServices ~ countUserFromTo ~ countBy:`, countBy);

    console.log(`🚀 ~ StatsServices ~ countUserFromTo ~ to:`, to);

    console.log(`🚀 ~ StatsServices ~ countUserFromTo ~ from:`, from);

    // const match = {};
    const format = countBy === "day" ? "%Y-%m-%d" : countBy === "month" ? "%Y-%m" : "";

    const pipeLines: PipelineStage[] = [
      {
        $match: {
          createdAt: {
            $gte: from,
            $lte: to,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
          // createdAt: { $push: "$createdAt" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          // createdAt: 1,
          _id: 0,
          label: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: 1,
        },
      },
    ];

    const count = await User.aggregate(pipeLines);

    return count;
  }
  async countRoomFromTo(from: Date, to: Date, countBy: TCountBy): Promise<TCountData[]> {
    console.log(`🚀 ~ StatsServices ~ countRoomFromTo ~ to:`, to);
    console.log(`🚀 ~ StatsServices ~ countRoomFromTo ~ from:`, from);
    console.log(`🚀 ~ StatsServices ~ countRoomFromTo ~ countBy:`, countBy);

    const format = countBy === "day" ? "%Y-%m-%d" : countBy === "month" ? "%Y-%m" : "";

    const pipeLines: PipelineStage[] = [
      {
        $match: {
          createdAt: {
            $gte: from,
            $lte: to,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
          // createdAt: { $push: "$createdAt" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          // createdAt: 1,
          _id: 0,
          label: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: 1,
        },
      },
    ];

    const count = await Room.aggregate(pipeLines);

    return count;
  }
  async countRoomNotVerified(): Promise<TCountData[]> {
    const pipeLines: PipelineStage[] = [
      {
        $match: {
          verified: false,
        },
      },
      {
        $group: {
          _id: "$verified",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
          count: 1,
          label: "Room not verified",
        },
      },
    ];

    const count = await Room.aggregate(pipeLines);

    return count;
  }
  async countRoomPerProvince(limit: number, province: string): Promise<TCountData[]> {
    const pipeLines: PipelineStage[] = [
      {
        $lookup: {
          from: "rooms", // Tên của collection chứa tài liệu IRoom
          localField: "room",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $group: {
          _id: "$province", // Nhóm theo trường province
          label: { $first: "$province" }, // Lấy giá trị province
          count: { $count: {} }, // Đếm số phòng trong mỗi tỉnh
        },
      },
    ];

    if (province) {
      pipeLines.push({
        $match: {
          label: province,
        },
      });
    }

    pipeLines.push(
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
        },
      },
      {
        $sort: {
          count: -1, // Sắp xếp giảm dần theo trường count
          label: 1,
        },
      },
      {
        $limit: limit, // Giới hạn kết quả cho 10 tài liệu
      }
    );

    const count = await RoomLocation.aggregate(pipeLines);

    return count;
  }

  async countAllRoom(): Promise<TCountData[]> {
    const doc = await Room.countDocuments();

    return [
      {
        label: "All room",
        count: doc,
      },
    ];
  }
  async countAllUser(): Promise<TCountData[]> {
    const doc = await User.countDocuments();

    return [
      {
        label: "All user",
        count: doc,
      },
    ];
  }

  async countRoom({ limit = 100, province, from, to, countBy, notVerified }: TCommonQuery): Promise<TCountData[] | undefined> {
    if (notVerified !== undefined) {
      const z = await this.countRoomNotVerified();

      return z;
    }

    if (typeof province === "string") {
      const z = await this.countRoomPerProvince(limit, province);

      z.forEach((r) => (r.image = provinceImagePathResolve(r.label)));

      return z;
    }
    if (typeof countBy === "string" && from !== undefined && to !== undefined) {
      console.log(`🚀 ~ StatsServices ~ countRoom ~ to:`, to);

      console.log(`🚀 ~ StatsServices ~ countRoom ~ from:`, from);

      const f = new Date(from as any);
      const t = new Date(to as any);

      if (isNaN(f.getTime()) || isNaN(t.getTime())) return;

      const z = await this.countRoomFromTo(f, t, countBy as TCountBy);
      console.log(`🚀 ~ StatsServices ~ countRoom ~ z:`, z);

      return z;
    }

    return await this.countAllRoom();
  }
  async countUser({ limit = 100, from, to, countBy }: TCommonQuery): Promise<TCountData[] | undefined> {
    //
    if (typeof countBy === "string" && from !== undefined && to !== undefined) {
      const f = new Date(from as any);
      const t = new Date(to as any);

      if (isNaN(f.getTime()) || isNaN(t.getTime())) return;

      const z = await this.countUserFromTo(f, t, countBy as TCountBy);
      console.log(`🚀 ~ StatsServices ~ countUser ~ z:`, z);

      return z;
    }

    return await this.countAllUser();
  }
}

export default new StatsServices();
