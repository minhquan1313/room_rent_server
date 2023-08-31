import { NextFunction, Request, Response } from "express";

class ApiV1Controller {
  // /api/v1/
  index(req: Request, res: Response, next: NextFunction) {
    res.send(`This is gate api V1`);
  }
}

export default new ApiV1Controller();
