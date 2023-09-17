import { errorResponse } from "@/Utils/errorRes";
import StatsServices from "@/services/StatsServices";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class StatisticsController {
  async countRoomProvince(req: Request, res: Response) {
    try {
      const { province } = req.params;
      const re = await StatsServices.countRoomProvince(province);

      res.json(re);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async countRoom(req: Request, res: Response) {
    try {
      const re = await StatsServices.countRoom(req.query as Record<string, string>);

      res.json(re);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new StatisticsController();
