import { RoomService, TRoomService } from "@/models/Room/RoomService";
import { RoomServiceCategory } from "@/models/Room/RoomServiceCategory";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { FilterQuery, Model, Query, Schema, Types, model } from "mongoose";

export interface IRoomServiceInCategory {
  _id: Types.ObjectId;

  service: Types.ObjectId;
  category: Types.ObjectId;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoomServiceInCategoryMethods {
  //  methods
  populateAll(): Promise<RoomServiceInCategoryDocument>;
}

interface RoomServiceInCategoryModel extends Model<IRoomServiceInCategory, {}, IRoomServiceInCategoryMethods> {
  // static methods
  findPopulated(query?: FilterQuery<IRoomServiceInCategory>): Query<RoomServiceInCategoryDocument[], RoomServiceInCategoryDocument, unknown, any, "find">;
}
export type RoomServiceInCategoryDocument = MongooseDocConvert<IRoomServiceInCategory, IRoomServiceInCategoryMethods>;

const schema = new Schema<IRoomServiceInCategory, RoomServiceInCategoryModel, IRoomServiceInCategoryMethods>(
  {
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "RoomService",
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "RoomServiceCategory",
    },
  },
  {
    timestamps: true,
    methods: {
      async populateAll(this: RoomServiceInCategoryDocument) {
        return await this.populate([
          {
            path: "service",
          },
          {
            path: "category",
          },
        ]);
      },
    },
    statics: {
      findPopulated(query) {
        return model("RoomServiceInCategory")
          .find(query)
          .populate([
            {
              path: "service",
            },
            {
              path: "category",
            },
          ]);
      },
    },
  }
);
schema.post("save", async function (doc, next) {
  await RoomServiceCategory.findOneAndUpdate(
    {
      _id: doc.category,
    },
    {
      $push: {
        services: doc.service,
      },
    }
  );

  next();
});

const RoomServiceInCategory = model<IRoomServiceInCategory, RoomServiceInCategoryModel>("RoomServiceInCategory", schema);

async function createRoomServiceInCategoryOnStart() {
  if (await RoomServiceInCategory.findOne()) return;

  // const obj: (Partial<IRoomServiceInCategory> & {})[] = [];

  const services = await RoomService.find();

  const cateTn = await RoomServiceCategory.findOne({ title: "tn" });
  const cateMt = await RoomServiceCategory.findOne({ title: "mt" });

  const tn: TRoomService[] = ["wifi", "mt", "tttp", "nth", "anc", "hgx", "og", "gl", "bnl", "kb", "mg", "dh", "tl", "gn", "taq", "bct", "bdxr", "can", "hb", "sv"];
  const mt: TRoomService[] = ["c", "st", "bv", "th", "cv", "bxb", "tttdtt"];

  services.forEach((r) => {
    if (tn.includes(r.title as any)) {
      RoomServiceInCategory.create({
        category: cateTn?._id,
        service: r._id,
      });
      // obj.push({
      //   category: cateTn?._id,
      //   service: r._id,
      // });
    } else if (mt.includes(r.title as any)) {
      RoomServiceInCategory.create({
        category: cateMt?._id,
        service: r._id,
      });
      // obj.push({
      //   category: cateMt?._id,
      //   service: r._id,
      // });
    }
  });
  // console.log(`🚀 ~ createRoomServiceInCategoryOnStart ~ obj:`, obj);

  // await RoomServiceInCategory.insertMany(obj);
}

export { RoomServiceInCategory, createRoomServiceInCategoryOnStart };
