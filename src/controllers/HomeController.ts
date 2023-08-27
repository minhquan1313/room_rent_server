import { NextFunction, Request, Response } from "express";

// User

class HomeController {
  // /
  async getIndex(req: Request, res: Response, next: NextFunction) {
    return res.send(`Hello, day la trang chu`);
  }
}

export default new HomeController();
