import { errorResponse } from "@/Utils/errorRes";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { User } from "@/models/User/User";
import PhoneService from "@/services/PhoneService";
import UserService, { UserFormData } from "@/services/UserService";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
// User

class UserController {
  // /api/v1/users/login
  postLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password, remember } = req.body;
    throw new Error("Method not implemented.");
  }

  // /api/v1/users/
  async get(req: Request, res: Response, next: NextFunction) {
    const params = req.params;

    const users = (await UserService.get(params)).map((u) => {
      const { password, ...user } = u.toObject();

      return user;
    });

    res.json(users);
  }

  // /api/v1/users/:userId
  async getSingle(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const userDoc = await User.findById(userId);

    if (!userDoc) return res.status(404).json(errorResponse("User not found"));

    const { password, ...user } = userDoc!.toObject();
    res.json(user);
  }

  // /api/v1/users/
  async post(req: Request, res: Response, next: NextFunction) {
    console.log(`🚀 ~ UserController ~ post ~ Inside post`);
    const { remember } = req.body;

    try {
      const userDoc = await UserService.createUser(req.body);
      console.log(`🚀 ~ UserController ~ post ~ userDoc:`, userDoc);

      const { password, ...user } = userDoc.toObject();

      console.log(`🚀 ~ UserController ~ post ~ user:`, user);

      console.log(`🚀 ~ UserController ~ post ~ user:`, user._id.toString());

      if (remember) {
        console.log(`🚀 ~ UserController ~ post ~ remember:`, remember);
        console.log(`🚀 ~ UserController ~ post ~ process.env.PRIVATE_JWT_KEY:`, process.env.PRIVATE_JWT_KEY || "");

        const token = jwt.sign(
          {
            userId: user._id.toString(),
          },
          process.env.PRIVATE_JWT_KEY || "",
          {
            expiresIn: "7d",
          }
        );
        console.log(`🚀 ~ UserController ~ post ~ token:`, token);

        (user as any)["token"] = token;
      }

      res.json(user);

      next();
    } catch (error) {
      return res.status(500).json(errorResponse(error));
    }
  }

  // /api/v1/users/:userId
  async patch(req: Request, res: Response, next: NextFunction) {}

  // /api/v1/users/:userId
  async delete(req: Request, res: Response, next: NextFunction) {}

  async validatePreCreateUser(req: Request, res: Response, next: NextFunction) {
    console.log(`🚀 ~ UserController ~ validatePreCreateUser ~ validatePreCreateUser:`);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errorResponse(errors.array()));
      }

      const { tell, region_code, username }: UserFormData = req.body;

      if (await User.findOne({ username })) {
        return res.status(400).json(errorResponse(`username exist`));
      }

      const isValidPhoneNumber = PhoneService.isValid(tell, region_code);
      console.log(`🚀 ~ UserController ~ validatePreCreateUser ~ tell, region_code:`, tell, region_code);

      if (!isValidPhoneNumber) return res.status(400).json(errorResponse(`invalid phone number`));

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
        return res.status(400).json(errorResponse(`phoneNumber`));
      }

      next();
    } catch (error) {
      return res.status(500).json(errorResponse(error));
    }
  }
}

export default new UserController();
