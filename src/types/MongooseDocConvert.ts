import { Document, Types } from "mongoose";

export type MongooseDocConvert<TType, TMethods> = Document<unknown, {}, TType> & Omit<TType & Required<{ _id: Types.ObjectId }>, keyof TMethods> & TMethods;
