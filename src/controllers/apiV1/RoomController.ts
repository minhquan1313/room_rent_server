import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Room } from "@/models/Room/Room";
import RoomImageService from "@/services/RoomImageService";
import RoomService, { TRoomJSON } from "@/services/RoomService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomController {
  async getSingle(req: Request, res: Response) {
    try {
      const room = await RoomService.get(req.params.id);

      res.json(room);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/rooms/
  async getOrSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      console.log(`🚀 ~ RoomController ~ getAll ~ query:`, query);

      res.json(await RoomService.getAll(query as any));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/test
  async postAddRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { files, user } = req;
      const { owner, ...formData }: TRoomJSON = req.body;

      let userId = owner ?? user!._id.toString();

      // Make room first
      const room = await RoomService.create(userId, formData);

      const roomId = room._id.toString();

      if (Array.isArray(files)) {
        // Add image to room later
        const imgIds = await RoomImageService.roomImagesUpload(files, userId, roomId, true);
        await RoomService.update(roomId, { images: imgIds });
      }

      return res.json(await (await Room.findById(roomId))?.populateAll());
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/:userId/:roomId
  async patchEditRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const { files, user } = req;

      /**
       * imagesOrders sẽ là 1 mảng dạng số number[]
       * gồm dãy số đầu là order của image có sẵn trên hệ thống
       * và dãy số sau là cho các file mới upload lên
       */
      const { images, owner, imagesOrders }: Partial<TRoomJSON> = req.body;

      let userId = owner ?? user!._id.toString();

      /**
       * Khi update ảnh có images[] gồm các id ảnh, thì dựa theo thứ tự id bên trong
       * mà gắn order lại theo thứ tự đó
       */
      if (images && imagesOrders) {
        await RoomImageService.reOrderImages(images, imagesOrders);
        // await RoomImageService.reOrderImagesWithIdsOrdered(images);
      }

      let newImagesIds: string[] = Array.isArray(images) ? images : [];
      if (Array.isArray(files) && files.length) {
        let orders: number[] | boolean = true;

        if (Array.isArray(imagesOrders)) {
          orders = imagesOrders.slice(newImagesIds.length);
        }

        newImagesIds.push(...(await RoomImageService.roomImagesUpload(files, userId, roomId, orders)));
      }

      const room = await RoomService.update(roomId, {
        ...req.body,
        images: newImagesIds,
      });
      console.log(`🚀 ~ RoomController ~ patchEditRoom ~ room:`, room);

      res.json(room);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/image/:roomId
  // async postNewImagesToRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
  //   try {
  //     const { files } = req;
  //     const { roomId } = req.params;

  //     const { imagesOrder }: { imagesOrder?: number[] } = req.body;
  //     if (!Array.isArray(files)) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`No images`));

  //     const room = await Room.findById(roomId).populate("owner");
  //     if (!room) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`Room not exist`));

  //     const userId = (room.owner as unknown as UserDocument)._id.toString();
  //     const imgIds = await RoomService.roomImagesUpload(files, userId, roomId, imagesOrder);

  //     const currentImg = (await RoomImage.find({ room: roomId })).map((r) => r._id.toString());
  //     const imagesIds = Array.from(new Set([...currentImg, ...imgIds]));

  //     const roomUpdated = await RoomService.update(roomId, { images: imagesIds });

  //     res.json(roomUpdated?.images);
  //   } catch (error: any) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
  //   }
  // }
}

export default new RoomController();
