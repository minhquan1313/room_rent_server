import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import MiscService from "@/services/MiscService";
import { HttpStatusCode } from "axios";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

class MiscController {
  async saveRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      // const { room }: TSaveRoomPayload = req.body;

      await MiscService.saveRoom(user!._id.toString(), req.body);

      res.status(HttpStatusCode.NoContent);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new MiscController();
