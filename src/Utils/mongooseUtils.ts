import { Document } from "mongoose";

export default {
  toObject(obj: Document | Document[]) {
    if (Array.isArray(obj)) {
      return obj.map((o) => o.toObject());
    } else {
      return obj.toObject();
    }
  },
};
