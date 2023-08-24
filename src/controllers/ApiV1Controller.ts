import { Role } from "@/models/Role";
import { User } from "@/models/User";
import { NextFunction, Request, Response } from "express";

// User

class ApiV1Controller {
  // /api/v1
  async get(req: Request, res: Response, next: NextFunction) {
    console.log(`Del user`);

    // await User.deleteMany({});

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
  }
  // /api/v1/delete-all
  async deleteDeleteAll(req: Request, res: Response, next: NextFunction) {
    console.log(`Deleting all`);

    await User.deleteMany({});
    await Role.deleteMany({});

    res.send(`Ok`);
  }
}

export default new ApiV1Controller();
