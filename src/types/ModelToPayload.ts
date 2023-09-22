import { Types } from "mongoose";

export type ModelToPayload<T> = {
  [P in keyof T]: T[P] extends Types.ObjectId ? string : T[P];
};
