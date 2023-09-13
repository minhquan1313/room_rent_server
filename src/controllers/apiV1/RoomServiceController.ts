import { RoomService } from "@/models/Room/RoomService";
import { NextFunction, Request, Response } from "express";

class RoomServiceController {
  postAdd(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  patch(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  delete(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  // /api/v1/room-services/
  async getAll(req: Request, res: Response, next: NextFunction) {
    const docs = await RoomService.find();
    res.json(docs);
  }
}

export default new RoomServiceController();
