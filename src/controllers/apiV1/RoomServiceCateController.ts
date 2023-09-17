import { errorResponse } from "@/Utils/errorRes";
import RoomServiceCategoryService from "@/services/RoomServiceCategoryService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomServiceCateController {
  async postAdd(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await RoomServiceCategoryService.addCategory(req.body);

      res.json(doc);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  patch(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(`ok`);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  delete(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(`ok`);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomServiceCategoryService.getAll();
      res.json(docs);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoomServiceCateController();
