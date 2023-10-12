import { RoomImage, RoomImageDocument } from "@/models/Room/RoomImage";
import UploadService from "@/services/UploadService";
import { Types } from "mongoose";

class RoomImageService {
  async autoReOrderDuplicateImages(roomId: string): Promise<RoomImageDocument[]> {
    const imgs = await RoomImage.find({
      room: roomId,
    }).sort({
      order: 1,
      updatedAt: -1,
    });

    // const min = imgs[0].order;
    // const max = imgs[imgs.length - 1].order;

    const nullOrderImgs = imgs.filter((r) => r.order === null);
    const nonNullOrderImgs = imgs.filter((r) => r.order !== null);

    let i = 1;
    for await (const img of [...nonNullOrderImgs, ...nullOrderImgs]) {
      let order = i++;
      console.log(`🚀 ~ forawait ~ img.order:`, img.order, img.image);
      if (img.order === order) continue;

      img.order = order;
      await img.save();
    }

    console.log(`🚀 ~ reOrderImages ~ imgs:`, imgs.map((r) => `"${r._id.toString()}"`).join(","));

    return imgs;
  }

  async reOrderImages(imageIds: string[], order: number[]) {
    let i = 0;
    for await (const _id of imageIds) {
      await RoomImage.updateOne(
        {
          _id,
        },
        {
          order: order[i++],
        }
      );
    }
  }

  async reOrderImagesWithIdsOrdered(_ids: string[], start = 1): Promise<void> {
    let i = start;
    for await (const _id of _ids) {
      await RoomImage.updateOne(
        {
          _id,
        },
        {
          order: i++,
        }
      );
    }
  }

  async roomImagesUpload(files: Express.Multer.File[], userId: string, roomId: string, autoOrder: boolean | number[] = false) {
    const uploadedImageIds: string[] = [];

    let orders: (undefined | number)[];

    if (autoOrder === true) {
      orders = files.map((r, i) => i + 1);
    } else if (Array.isArray(autoOrder)) {
      orders = files.map((r, i) => autoOrder[i]);
    } else {
      orders = Array(files.length).fill(undefined);
    }

    let i = 0;
    for await (const file of files) {
      const newPath = await UploadService.userRoomImageFileUpload({ file, roomId });
      const roomImage = await RoomImage.create({
        room: roomId,
        image: newPath.srcForDb,
        order: orders[i++],
      });

      uploadedImageIds.push(roomImage._id.toString());
    }

    return uploadedImageIds;
  }

  async deleteImagesOfRoom(roomId: string | Types.ObjectId) {
    await RoomImage.deleteMany({ room: roomId });
    UploadService.unLinkRoomFolderSync(String(roomId));
  }
}

export default new RoomImageService();
