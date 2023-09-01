import { errorResponse } from "@/Utils/errorRes";
import { LoginToken } from "@/models/User/LoginToken";
import { Role, TRole } from "@/models/User/Role";
import { User, UserDocument } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export type RequestAuthenticate = Request & {
  user?: UserDocument;
  roleTitle?: TRole;
};
export async function AuthenticateMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) throw new Error(`Unauthorized`);

    const [type, token] = bearerToken.split(" ");
    if (type !== "Bearer") throw new Error(`Unauthorized`);

    const loginToken = await LoginToken.findOne({ token });
    if (!loginToken || loginToken.user === null) throw new Error(`Unauthorized`);

    const user = await User.findOne(loginToken.user);
    const now = new Date();

    if (!user || !user.role || user.disabled || loginToken.expire.getTime() < now.getTime()) {
      // Token het han|user da bi vo hieu hoa, dang nhap lai
      await loginToken.deleteOne();
      throw new Error(`Unauthorized`);
    }

    // extendsTime background
    LoginTokenService.extendsTime(loginToken.token);

    const role = await Role.findById(user.role);

    // authorized success
    req.user = user;
    req.roleTitle = role?.title as any;
    next();
  } catch (error: any) {
    // "Unauthorized"
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse(error.toString()));
  }
}
