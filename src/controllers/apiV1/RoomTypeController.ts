import { errorResponse } from "@/Utils/errorRes";
import RoomTypeService from "@/services/RoomTypeService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomTypeController {
  async postAdd(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomTypeService.add(req.body);

      res.json(docs);
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.params;

      await RoomTypeService.update(roleId, req.body);

      return res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.params;
      console.log(`🚀 ~ RoomTypeController ~ delete ~ roleId:`, roleId);

      await RoomTypeService.delete(roleId);

      return res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  // /api/v1/room-types/
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomTypeService.list();

      res.json(docs);
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
}

export default new RoomTypeController();
