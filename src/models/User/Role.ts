import mongoose, { Schema } from "mongoose";

export type TRole = "admin" | "admin_lvl_2" | "user" | "owner";

const schema = new Schema(
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
      getRoleAdmin() {
        return this.findOne({ title: "admin" });
      },
      getRoleAdmin2() {
        return this.findOne({ title: "admin_lvl_2" });
      },
      getRoleUser() {
        return this.findOne({ title: "user" });
      },
      getRoleOwner() {
        return this.findOne({ title: "owner" });
      },
    },
  }
);
const Role = mongoose.model("Role", schema);

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
