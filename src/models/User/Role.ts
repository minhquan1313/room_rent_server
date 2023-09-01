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
  getRoleAdmin(): Promise<RoleDocument | null>;
  getRoleAdmin2(): Promise<RoleDocument | null>;
  getRoleUser(): Promise<RoleDocument | null>;
  getRoleOwner(): Promise<RoleDocument | null>;
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
    statics: {
      async getRoleAdmin(): Promise<RoleDocument | null> {
        return await this.findOne({ title: "admin" });
      },
      async getRoleAdmin2(): Promise<RoleDocument | null> {
        return await this.findOne({ title: "admin_lvl_2" });
      },
      async getRoleUser(): Promise<RoleDocument | null> {
        return await this.findOne({ title: "user" });
      },
      async getRoleOwner(): Promise<RoleDocument | null> {
        return await this.findOne({ title: "owner" });
      },
    },
  }
);
const Role = mongoose.model<IRole, RoleModel>("Role", schema);

async function autoCreateRolesOnStart() {
  const r = await mongoose.model("Role").findOne();
  if (r) return;

  await Role.insertMany([
    {
      _id: "64e85781e6da92d58fe95d46",
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
  ]);

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
