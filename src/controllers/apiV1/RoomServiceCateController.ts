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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500",error.toString()));
    }
  }
  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceCateId } = req.params;

      await RoomServiceCategoryService.update(serviceCateId, req.body);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500",error.toString()));
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceCateId } = req.params;

      await RoomServiceCategoryService.delete(serviceCateId);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500",error.toString()));
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await RoomServiceCategoryService.list();

      res.json(docs);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500",error.toString()));
    }
  }
}

export default new RoomServiceCateController();
