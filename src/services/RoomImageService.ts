import { RoomImage, RoomImageDocument } from "@/models/Room/RoomImage";

class RoomImageService {
  async reOrderImages(roomId: string): Promise<RoomImageDocument[]> {
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
}

export default new RoomImageService();
