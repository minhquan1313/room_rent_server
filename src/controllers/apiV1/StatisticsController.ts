import { errorResponse } from "@/Utils/errorRes";
import StatsServices from "@/services/StatsServices";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class StatisticsController {
  async countUser(req: Request, res: Response) {
    try {
      const re = await StatsServices.countUser(req.query);

      res.json(re);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async countRoom(req: Request, res: Response) {
    try {
      const re = await StatsServices.countRoom(req.query);

      res.json(re);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
}

export default new StatisticsController();
