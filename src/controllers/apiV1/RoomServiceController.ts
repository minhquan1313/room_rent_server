import { errorResponse } from "@/Utils/errorRes";
import RoomSvService from "@/services/RoomSvService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomServiceController {
  async postAdd(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomSvService.add(req.body);

      res.json(docs);
    } catch (error: any) {
      res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.params;

      await RoomSvService.update(serviceId, req.body);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.params;

      await RoomSvService.delete(serviceId);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  // /api/v1/room-services/
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomSvService.list(req.params);

      res.json(docs);
    } catch (error: any) {
      res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
}

export default new RoomServiceController();
