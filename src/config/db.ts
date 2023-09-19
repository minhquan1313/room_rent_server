import mongoose from "mongoose";

const db = {
  async connect() {
    const DB_URL = process.env.DB_URL;

    try {
      if (DB_URL) {
        await mongoose.connect(DB_URL);
        console.log(`Connect to db SUCCESS`);
      } else {
        throw new Error(`Missing DB_URL`);
      }
    } catch (error) {
      console.log(`🚀 ~ Error connecting db:`, error);
    }
  },
};

export default db;
