import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import UserService from "@/services/UserService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class UserController {
  // /api/v1/users/
  async get(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const users = await UserService.get(req.query as any);

      res.json(users);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", String(error)));
    }
  }

  // /api/v1/users/:userId
  async getSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      console.log(`🚀 ~ UserController ~ getSingle ~ userId:`, userId);

      const userDoc = await User.findById(userId);

      if (!userDoc) return res.status(StatusCodes.NOT_FOUND).json(errorResponse("404002"));

      await userDoc.populateAll();

      const user = userDoc.toObject();

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }

  // /api/v1/users/login-token
  async postLoginToken(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user: userDoc, token } = req;

      await userDoc?.populateAll();
      const user = userDoc?.toObject();

      (user as any)["token"] = token;

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }

  // /api/v1/users/login
  async postLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const encodedPass = LoginTokenService.encodePassword(password);
      const userDoc = await (
        await User.findOne({
          username,
          $or: [
            {
              password: encodedPass,
            },
            { password },
          ],
        })
      )?.populateAll();
      if (!userDoc) return res.status(StatusCodes.NOT_FOUND).json(errorResponse("404001", `Tên đăng nhập hoặc mật khẩu sai`));

      const user = userDoc.toObject();
      const { username: _username } = user;

      const token = await LoginTokenService.makeToken({ username: _username, userId: userDoc._id.toString() });
      (user as any)["token"] = token;

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  // /api/v1/users/
  async postCreateUser(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const userDoc = await UserService.createUser(req.body);

      if (!userDoc) throw new Error(`Can't create user`);

      const user = userDoc.toObject();

      const token = await LoginTokenService.makeToken({ username: user.username, userId: user._id.toString() });
      (user as any)["token"] = token;

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }

  // /api/v1/users/:userId
  async patch(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      console.log(`🚀 ~ UserController ~ patch ~ userId:`, userId);

      req.body.file = req.file;

      await UserService.updateUser(userId, req.body);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }

  // /api/v1/users/:userId
  async delete(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      await UserService.deleteUser(userId);

      res.status(StatusCodes.NO_CONTENT).json();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
}

export default new UserController();
