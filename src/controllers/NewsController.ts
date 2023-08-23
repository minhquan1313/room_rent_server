import { Request, Response } from "express";

class NewsController {
  // /news
  getIndex(req: Request, res: Response) {
    res.send("news");
  }

  // /news/:newNTitle
  getNew(req: Request, res: Response) {
    res.send("new Title " + req.params.newNTitle);
  }
}

export default new NewsController();
