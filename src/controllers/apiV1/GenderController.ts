import { Gender } from "@/models/User/Gender";
import { NextFunction, Request, Response } from "express";

class GenderController {
  postAdd(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  patch(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  delete(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  // /api/v1/genders/
  async getAll(req: Request, res: Response, next: NextFunction) {
    const docs = await Gender.find().lean();

    res.json(docs);
  }
}

export default new GenderController();
