import { Types } from "mongoose";

export type ModelToPayload<T> = {
  [P in keyof T]: T[P] extends Types.ObjectId | null | Date
    ? //
      string | undefined
    : T[P] extends any[]
    ? string[] | undefined
    : T[P] | undefined;
};
