import { Room, populatePaths } from "@/models/Room/Room";
import { ISaved, Saved } from "@/models/User/Saved";
import { TCommonQuery } from "@/types/TCommonQuery";
import { Types } from "mongoose";

type TQuery = TCommonQuery &
  Partial<ISaved> & {
    to_room?: string;
  };
class SavedService {
  async search({ limit = 99, page = 1, to_room, sort_field = "createdAt", sort = -1, saved, ...query }: TQuery) {
    if (query.user) {
      query.user = new Types.ObjectId(query.user);
    }
    if (query.room) {
      query.room = new Types.ObjectId(query.room);
    }

    console.log(`🚀 ~ SavedService ~ search ~ query:`, query);
    const q = Saved.aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          [sort_field]: sort,
        },
      },
    ]);

    if (limit !== 0) {
      q.skip(limit * (page - 1));

      q.limit(limit);
    }

    if (to_room !== undefined) {
      q.append({
        $lookup: {
          localField: "room",
          foreignField: "_id",
          from: "rooms",
          as: "room",
        },
      });

      q.append({
        $unwind: "$room",
      });

      q.append({
        $replaceRoot: {
          newRoot: "$room",
        },
      });

      if (saved !== undefined) {
        q.append({
          $lookup: {
            from: "saveds",
            localField: "_id",
            foreignField: "room",
            as: "saved",
          },
        });
      }
    }

    const doc = await q.exec();

    if (to_room !== undefined) {
      await Room.populate(doc, populatePaths);
    }

    console.log(`🚀 ~ SavedService ~ search ~ doc:`, JSON.parse(JSON.stringify(doc)));

    return doc;
  }

  async add(user: string, room: string) {
    return await Saved.create({
      user,
      room,
    });
  }

  async delete(id: string) {
    return await Saved.deleteOne({
      _id: id,
    });
  }
}

export default new SavedService();
