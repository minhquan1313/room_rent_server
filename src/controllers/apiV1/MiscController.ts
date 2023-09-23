import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import MiscService from "@/services/MiscService";
import NotificationService, { TSubscription } from "@/services/NotificationService";
import { HttpStatusCode } from "axios";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

class MiscController {
  async subscribePush(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      console.log(`🚀 ~ MiscController ~ subscribePush ~ req.body:`, req.body);

      const doc = await NotificationService.newSubscribe({
        ...(req.body as TSubscription),

        user: String(user?._id),
      });
      console.log(`🚀 ~ MiscController ~ subscribePush ~ doc:`, doc);

      res.status(HttpStatusCode.NoContent).json({});
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ subscribePush ~ error:`, error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async saveRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      // const { room }: TSaveRoomPayload = req.body;

      await MiscService.saveRoom(user!._id.toString(), req.body);

      res.status(HttpStatusCode.NoContent).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new MiscController();
