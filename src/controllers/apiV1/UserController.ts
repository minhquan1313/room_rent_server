import { errorResponse } from "@/Utils/errorRes";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import PhoneService from "@/services/PhoneService";
import UserService, { UserFormData } from "@/services/UserService";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

// User

class UserController {
  postCreateUser(req: Request, res: Response) {
    const { remember } = req.body;
    if (!remember) return;

    res.cookie("remember", "rememberValue");
  }
  // /api/v1/users/login
  postLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password, remember } = req.body;
    throw new Error("Method not implemented.");
  }

  // /api/v1/users/
  async get(req: Request, res: Response, next: NextFunction) {
    const params = req.params;

    const users = await UserService.get(params);
    res.json(users);
  }

  // /api/v1/users/:userId
  async getSingle(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const userDoc = await UserService.getById(userId);

    res.json(userDoc);
  }

  // /api/v1/users/
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);

      res.json(user);

      next();
    } catch (error) {
      return res.status(500);
    }
  }

  // /api/v1/users/:userId
  async patch(req: Request, res: Response, next: NextFunction) {}

  // /api/v1/users/:userId
  async delete(req: Request, res: Response, next: NextFunction) {}

  async validatePreCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errorResponse(errors.array()));
      }

      const { tell, region_code }: UserFormData = req.body;

      const isValid = PhoneService.isValid(tell, region_code);

      if (!isValid) return res.status(400).json(errorResponse());

      const phoneNumber = await PhoneNumber.findOne({
        $or: [
          {
            e164_format: tell,
          },
          {
            national_number: parseInt(tell),
          },
        ],
      });
      if (phoneNumber) {
        return res.status(400).json(errorResponse());
      }

      next();
    } catch (error) {
      return res.status(500).json(errorResponse());
    }
  }
}

export default new UserController();
