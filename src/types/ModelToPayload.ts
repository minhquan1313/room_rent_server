import { Types } from "mongoose";

export type ModelToPayload<T> = {
  [P in keyof T]: T[P] extends Types.ObjectId | null ? string | undefined : T[P];
};
