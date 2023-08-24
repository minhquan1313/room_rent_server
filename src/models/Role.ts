import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
});
const Role = mongoose.model("Role", schema);

const autoCreateRoles = () => {
  mongoose.connection.once("open", () => {
    mongoose
      .model("Role")
      .findOne()
      .then((r) => {
        if (r !== null) return;

        Role.insertMany([
          {
            id: 1,
            title: "admin",
          },
          {
            id: 2,
            title: "owner",
          },
          {
            id: 3,
            title: "user",
          },
        ]);
      });

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
  });
};

export { Role, autoCreateRoles };
