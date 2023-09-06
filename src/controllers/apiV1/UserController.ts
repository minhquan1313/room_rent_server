import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { TRole } from "@/models/User/Role";
import { User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import UploadService from "@/services/UploadService";
import UserService from "@/services/UserService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class UserController {
  // /api/v1/users/upload-many
  async uploadMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { files } = req;
      if (!files || !Array.isArray(files)) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(`Lỗi up ảnh`));
      console.log(`🚀 ~ UserController ~ uploadMany ~ files:`, files);

      for (const file of files) {
        const newPath = await UploadService.userAvatarFileUpload(file, "123");
        console.log(`🚀 ~ UserController ~ uploadMany ~ newPath:`, newPath);
      }

      return res.json(`Uploaded`);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(`Lỗi up ảnh`));
    }
  }
  // /api/v1/users/upload
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      if (!file) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(`Lỗi up ảnh`));
      console.log(`🚀 ~ UserController ~ upload ~ file:`, file);

      const newPath = await UploadService.userAvatarFileUpload(file, "123");
      console.log(`🚀 ~ UserController ~ upload ~ newPath:`, newPath);

      res.json(`Uploaded`);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(`Lỗi up ảnh`));
    }
  }
  // /api/v1/users/
  async get(req: RequestAuthenticate, res: Response, next: NextFunction) {
    const users = await UserService.get(req.query);

    res.json(users);
  }

  // /api/v1/users/:userId
  async getSingle(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const userDoc = await User.findById(userId);

    if (!userDoc) return res.status(StatusCodes.NOT_FOUND).json(errorResponse("User not found"));

    const user = userDoc.toObject();

    res.json(user);
  }

  // /api/v1/users/login-token
  async postLoginToken(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user: userDoc, token } = req;

      await userDoc?.populateAll();
      const user = userDoc?.toObject();
      // const user = await (await User.findOne(loginToken.user))?.populateAll();

      (user as any)["token"] = token;

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/users/login
  async postLogin(req: Request, res: Response, next: NextFunction) {
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
    if (!userDoc) return res.status(StatusCodes.NOT_FOUND).json(errorResponse(`Invalid username or password`));

    const user = userDoc.toObject();
    const { username: _username } = user;

    const token = await LoginTokenService.makeToken({ username: _username, userId: userDoc._id.toString() });
    (user as any)["token"] = token;

    res.json(user);
  }
  // /api/v1/users/
  async post(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      console.log(`🚀 ~ UserController ~ post ~ userDoc:`);
      const userDoc = await UserService.createUser(req.body);
      console.log(`🚀 ~ UserController ~ post ~ userDoc:`, userDoc);

      if (!userDoc) throw new Error(`Server error`);

      const user = userDoc.toObject();

      const token = await LoginTokenService.makeToken({ username: user.username, userId: user._id.toString() });
      (user as any)["token"] = token;
      console.log(`🚀 ~ UserController ~ post ~ user.username:`, user.username);

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/users/role/:userId
  async patchChangeRole(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role }: { role: TRole } = req.body;

      const userDoc = await User.findById(userId).populate("role");
      if (!userDoc) return res.status(StatusCodes.NOT_FOUND).json(errorResponse(`User to change not found`));

      // if ((userDoc.role as any).title === "admin" || role === "admin") {
      //   // Changing admin role, or promote someone to be admin
      //   return res.status(StatusCodes.FORBIDDEN).json(errorResponse(`Changing from or to <admin> role is not allow`));
      // }

      const user = await UserService.changeRole(userId, role);

      return res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/users/owner_banner/:userId
  async patchOwnerBanner(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      const { userId } = req.params;
      if (!file) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`No file`));

      const newPath = await UploadService.userAvatarFileUpload(file, userId);

      const src = newPath.srcForDb;
      const user = await UserService.updateUser(userId, { owner_banner: src });
      console.log(`🚀 ~ UserController ~ patchImage ~ user:`, user);

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  // /api/v1/users/image/:userId
  async patchImage(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      // {
      //   fieldname: "image",
      //   originalname: "nficon2016.ico",
      //   encoding: "7bit",
      //   mimetype: "image/vnd.microsoft.icon",
      //   destination: "E:\\Workspace\\school\\quan_ly_nha_tro\\room_rent_server\\temp",
      //   filename: "nficon2016_1693725805214_19296.ico",
      //   path: "E:\\Workspace\\school\\quan_ly_nha_tro\\room_rent_server\\temp\\nficon2016_1693725805214_19296.ico",
      //   size: 16958,
      // };
      console.log(`🚀 ~ UserController ~ patchImage ~ file:`, file);

      const { userId } = req.params;
      if (!file) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse(`No file`));

      const newPath = await UploadService.userAvatarFileUpload(file, userId);

      const src = newPath.srcForDb;
      const user = await UserService.updateUser(userId, { image: src });
      console.log(`🚀 ~ UserController ~ patchImage ~ user:`, user);

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/users/:userId
  async patch(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await UserService.updateUser(userId, req.body);

      res.json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }

  // /api/v1/users/:userId
  async delete(req: RequestAuthenticate, res: Response, next: NextFunction) {
    const { userId } = req.params;

    if (!(await UserService.deleteUser(userId))) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(`Can't delete`));
    }

    res.status(StatusCodes.NO_CONTENT).json();
  }
}

export default new UserController();
