import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Room } from "@/models/Room/Room";
import { RoomImage } from "@/models/Room/RoomImage";
import { User, UserDocument } from "@/models/User/User";
import RoomService, { TRoomJSON } from "@/services/RoomService";
import UploadService from "@/services/UploadService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomController {
  validatePreAddRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    next();
  }

  // /api/v1/rooms/
  async postAddRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;

      const { owner, ...formData }: TRoomJSON = req.body;

      let uId = user!._id.toString();
      if (owner && (await User.findById(owner))) uId = owner;

      const room = await RoomService.create(uId, formData);

      res.json(room);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/image/:roomId
  async postUploadImagesAndAdd(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { files } = req;
      const { roomId } = req.params;
      req.body;
      console.log(`🚀 ~ RoomController ~ patchImage ~ req.body:`, req.body);

      if (!Array.isArray(files)) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`No images`));

      const room = await Room.findById(roomId).populate("owner");
      if (!room) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`Room not exist`));

      const owner = room.owner as unknown as UserDocument;

      const uploadedImageIds: string[] = [];
      for await (const file of files) {
        const newPath = await UploadService.userRoomImageFileUpload(file, owner._id.toString(), roomId);

        const roomImage = await RoomService.newImageUploaded(roomId, newPath.srcForDb);

        uploadedImageIds.push(roomImage._id.toString());
      }

      const currentImg = (await RoomImage.find({ room: roomId })).map((r) => r._id.toString());
      const imagesIds = Array.from(new Set([...currentImg, ...uploadedImageIds]));

      const user = await RoomService.update(roomId, { images: imagesIds });

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/image/:roomId/:imageId
  async patchImageOrder(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { roomId, imageId } = req.params;
      console.log(`🚀 ~ RoomController ~ patchImage ~ imageId:`, imageId);

      console.log(`🚀 ~ RoomController ~ patchImage ~ roomId:`, roomId);

      res.json("ok");
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/rooms/:roomId
  async patchEditRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      const formData: Partial<TRoomJSON> = req.body;

      const room = await RoomService.update(roomId, formData);

      res.json(room);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await RoomService.getAll());
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoomController();
