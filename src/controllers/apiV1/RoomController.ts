import { errorResponse } from "@/Utils/errorRes";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomController {
  // /api/v1/rooms/
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoomController();
