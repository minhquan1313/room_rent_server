import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Room } from "@/models/Room/Room";
import { UserDocument } from "@/models/User/User";
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
      console.log(`🚀 ~ RoomController ~ postAddRoom ~ user:`, user);

      const formData: TRoomJSON = req.body;

      const room = await RoomService.create(user!._id, formData);

      res.json(room);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/image/:roomId
  async patchImage(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { files } = req;
      const { roomId } = req.params;
      if (!Array.isArray(files)) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`No images`));

      const room = await Room.findById(roomId).populate("owner");
      if (!room) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`Room not exist`));

      const owner = room.owner as unknown as UserDocument;

      const sources: string[] = [];
      for await (const file of files) {
        const newPath = await UploadService.userRoomImageFileUpload(file, owner._id.toString(), roomId);

        const roomImage = await RoomService.newImageUploaded(roomId, newPath.srcForDb);

        sources.push(roomImage._id.toString());
      }
      console.log(`🚀 ~ RoomController ~ forawait ~ sources:`, sources);

      const user = await RoomService.update(roomId, { images: sources });

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/rooms/
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoomController();
