import { User } from "@/models/User";
import { NextFunction, Request, Response } from "express";

// User

class HomeController {
  // /
  async getIndex(req: Request, res: Response, next: NextFunction) {
    console.log(`Del user`);

    await User.deleteMany({});

    console.log(`Creating user`);
    await User.create({
      username: "test",
      password: "123",
    });
    console.log(`Done creating user`);

    User.find()
      .then((u) => {
        res.json(u);
      })
      .catch(next);

    // return res.status(400).json(errorResponse("Có lỗi trong lúc tìm user"));
  }
}

export default new HomeController();
