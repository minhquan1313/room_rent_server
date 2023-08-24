import mongoose from "mongoose";

const db = {
  async connect() {
    const DB_URL = process.env.DB_URL;

    try {
      if (DB_URL) {
        await mongoose.connect(DB_URL);
        console.log(`Connect to db SUCCESS`);

        return true;
      } else {
        throw new Error(`No DB_URL`);
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  },
};

export default db;
