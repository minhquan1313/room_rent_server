import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import SavedService from "@/services/SavedService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class SavedController {
  async postAdd(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, roomId } = req.body;

      res.json(await SavedService.add(userId, roomId));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      res.json(await SavedService.delete(id));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getOrSearch(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      res.json(await SavedService.search(req.query as any));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
}

export default new SavedController();
