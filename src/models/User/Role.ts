import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import mongoose, { Model, Schema, Types } from "mongoose";

export type TRole = "admin" | "admin_lvl_2" | "user" | "owner";
export interface IRole {
  _id: Types.ObjectId;

  title: TRole;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IRoleMethods {
  //  methods
}

interface RoleModel extends Model<IRole, {}, IRoleMethods> {
  // static methods
}
export type RoleDocument = MongooseDocConvert<IRole, IRoleMethods>;

const schema = new Schema<IRole, RoleModel, IRoleMethods>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    display_name: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const Role = mongoose.model<IRole, RoleModel>("Role", schema);

async function autoCreateRolesOnStart() {
  if (await mongoose.model("Role").findOne()) return;

  const obj: (Partial<IRole> & {
    title: TRole;
  })[] = [
    {
      _id: "64e85781e6da92d58fe95d46" as any,
      title: "admin",
      display_name: "Admin",
    },
    {
      title: "admin_lvl_2",
      display_name: "Admin cấp 2",
    },
    {
      title: "owner",
      display_name: "Chủ phòng",
    },
    {
      title: "user",
      display_name: "Người dùng",
    },
  ];

  await Role.insertMany(obj);

  //   mongoose.connection.db
  //     .listCollections()
  //     .toArray()
  //     .then((collections) => {
  //       const roleCollection = collections.find((c) => c.name === "roles");
  //       if (roleCollection) return;

  //       Role.insertMany([
  //         {
  //           title: "admin",
  //           displayName: "Admin",
  //         },
  //         {
  //           title: "owner",
  //           displayName: "Chủ phòng",
  //         },
  //         {
  //           title: "user",
  //           displayName: "Người dùng",
  //         },
  //       ]);
  //     });
}

export { Role, autoCreateRolesOnStart };
// 64e8363104671a73bf07d4c1
// 64e8363104671a73bf07d4c1
