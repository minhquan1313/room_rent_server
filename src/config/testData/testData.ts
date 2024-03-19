import { dumpDataObjectIdConvert } from "@/Utils/dumpDataObjectIdConvert";
import { readFileSync, readdirSync } from "fs";
import mongoose from "mongoose";
import { join } from "path";

export const testData = {
  async add() {
    // if (await User.findOne()) return;

    // (await mongoose.connection.db.listCollections().toArray()).forEach(function (names) {
    //   console.log(`mongoexport -d room_rent_dev -c ${names.name} --jsonArray -o ./room_rent_dev/room_rent_dev.${names.name}.json`);
    // });
    // console.log(`🚀 ~ getModelName ~ mongoose.modelNames():`, mongoose.modelNames());
    const dir = join(__dirname, "./dump");
    const fileNames = readdirSync(dir);

    for await (const fileName of fileNames) {
      try {
        const [db, collection, fileType] = fileName.split(".");
        const modelName = this.getModelName(collection);

        if (!modelName) {
          console.error(`modelName not found ${collection}`);
          continue;
        }

        if (await mongoose.model(modelName).findOne()) continue;

        const data = JSON.parse(
          readFileSync(join(dir, fileName), {
            encoding: "utf-8",
          })
        );

        dumpDataObjectIdConvert(data);

        await mongoose.model(modelName).insertMany(data);
      } catch (error) {
        console.log(`🚀 ~ fileNames.forEach ~ error:`, error);
      }
    }
  },

  getModelName(collection: string) {
    /**
     * 'chatmemebers', 'users', ...
     *
     * Object.keys(mongoose.models) => names of model mongoose (User)
     *
     * mongoose.models["ChatMember"].collection.name => name in collection db (users)
     */
    const modelsName = Object.keys(mongoose.models);

    for (const name of modelsName) {
      if (mongoose.models[name].collection.name !== collection) continue;

      return name;
    }

    return undefined;
  },
};
