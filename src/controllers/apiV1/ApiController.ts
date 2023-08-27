import preload from "@/Utils/preload";
import { Email } from "@/models/User/Email";
import { Role } from "@/models/User/Role";
import { User } from "@/models/User/User";
import { NextFunction, Request, Response } from "express";

// User

class ApiV1Controller {
  // /api/v1/preload
  async getPreload(req: Request, res: Response, next: NextFunction) {
    await preload();

    res.send("OK");
  }

  // /api/v1/delete-all
  async deleteAll(req: Request, res: Response, next: NextFunction) {
    console.log(`Deleting all`);

    await User.deleteMany();
    // const users = await User.find();

    // users.forEach((user) => user.delete());

    await Role.deleteMany();
    await Email.deleteMany();

    res.send(`Ok`);
  }
}

export default new ApiV1Controller();
