import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import RoomService, { RoomSearchQuery } from "@/services/RoomService";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

class StatisticsController {
  // /api/v1/rooms/
  async getAll(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const query: RoomSearchQuery = req.query;
      console.log(`🚀 ~ RoomController ~ getAll ~ query:`, query);

      res.json(await RoomService.getAll(query));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new StatisticsController();
