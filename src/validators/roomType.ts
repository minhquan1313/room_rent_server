import { RoomType } from "@/models/Room/RoomType";
import { check } from "express-validator";

export const validateRoomTypePost = () => {
  return [
    //
    check("title", "Key trống").notEmpty(),
    check("title", "Key đã tồn tại").custom(async (title) => {
      console.log(`🚀 ~ check ~ title:`, title);
      const doc = await RoomType.findOne({
        title,
      }).lean();
      console.log(`🚀 ~ check ~ doc:`, doc);

      if (doc) throw new Error();
    }),
  ];
};
export const validateRoomTypePatch = () => {
  return [
    //
    check("title", "Key trống").optional().notEmpty(),
    check("title", "Key đã tồn tại")
      .optional()
      .custom(async (title) => {
        const doc = await RoomType.findOne({
          title,
        });

        if (doc) throw new Error();
      }),
  ];
};
