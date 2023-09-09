import { RoomType } from "@/models/Room/RoomType";
import { NextFunction, Request, Response } from "express";

class RoomTypeController {
  postAdd(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  patch(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  delete(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  // /api/v1/room-types/
  async getAll(req: Request, res: Response, next: NextFunction) {
    const docs = await RoomType.find();

    res.json(docs);
  }
}

export default new RoomTypeController();
